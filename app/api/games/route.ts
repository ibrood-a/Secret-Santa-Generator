import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { getServerSession } from "next-auth";
import { prisma } from "../../../lib/prisma";
import { buildAssignments } from "../../../lib/assignment";
import authOptions from "../../lib/authOptions";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const name: string | undefined = body?.name;
    const hostName: string | undefined = body?.hostName;
    const participantInput: Array<{ name: string; email: string }> = Array.isArray(
      body?.participants
    )
      ? body.participants
      : [];
    const restrictionsInput: Array<[string, string]> = Array.isArray(body?.restrictions)
      ? body.restrictions
      : [];

    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }
    if (!hostName?.trim()) {
      return NextResponse.json({ error: "Host name is required." }, { status: 400 });
    }

    const sanitizedParticipants = participantInput
      .map((p) => ({
        name: typeof p?.name === "string" ? p.name.trim() : "",
        email: typeof p?.email === "string" ? p.email.trim() : ""
      }))
      .filter((p) => p.name && p.email);
    const uniqueNames = Array.from(new Set(sanitizedParticipants.map((p) => p.name.toLowerCase())))
      .map((lower) => sanitizedParticipants.find((p) => p.name.toLowerCase() === lower) as {
        name: string;
        email: string;
      });

    const sanitizedRestrictions = restrictionsInput
      .map((pair) => (Array.isArray(pair) && pair.length === 2 ? pair : null))
      .filter((pair): pair is [string, string] => Boolean(pair))
      .map(([a, b]) => [a?.trim(), b?.trim()] as [string, string])
      .filter(([a, b]) => a && b && a !== b)
      .map(([a, b]) => {
        const [first, second] =
          a.toLocaleLowerCase() < b.toLocaleLowerCase() ? [a, b] : [b, a];
        return [first, second] as [string, string];
      });
    const uniqueRestrictionKeys = new Set<string>();
    const filteredRestrictions: Array<[string, string]> = [];
    for (const [a, b] of sanitizedRestrictions) {
      const key = `${a.toLocaleLowerCase()}|${b.toLocaleLowerCase()}`;
      if (!uniqueRestrictionKeys.has(key)) {
        uniqueRestrictionKeys.add(key);
        filteredRestrictions.push([a, b]);
      }
    }

    if (uniqueNames.length < 2) {
      return NextResponse.json({ error: "Add at least two participants." }, { status: 400 });
    }

    const baseUrl =
      req.headers.get("origin") ||
      process.env.APP_BASE_URL ||
      `${process.env.VERCEL_URL ? "https://" : "http://"}${process.env.VERCEL_URL ?? "localhost:3000"}`;

    const game = await prisma.$transaction(async (tx) => {
      const createdGame = await tx.game.create({
        data: {
          name: name.trim(),
          organizerName: hostName.trim(),
          organizerEmail: session.user.email || "",
          userId,
          participants: {
            create: uniqueNames.map((participant) => ({
              name: participant.name,
              email: participant.email,
              accessToken: crypto.randomUUID()
            }))
          }
        },
        include: { participants: true }
      });

      // Map restriction names to participant IDs (symmetric)
      const nameToId = new Map(
        createdGame.participants.map((p) => [p.name.toLocaleLowerCase(), p.id])
      );

      const restrictionPairs: Array<[string, string]> = [];
      for (const [a, b] of filteredRestrictions) {
        const aId = nameToId.get(a.toLocaleLowerCase());
        const bId = nameToId.get(b.toLocaleLowerCase());
        if (aId && bId) {
          restrictionPairs.push([aId, bId], [bId, aId]);
        }
      }

      if (restrictionPairs.length > 0) {
        await tx.restriction.createMany({
          data: restrictionPairs.map(([participantId, blockedParticipantId]) => ({
            participantId,
            blockedParticipantId
          })),
          skipDuplicates: true
        });
      }

      const assignments = buildAssignments(
        createdGame.participants.map((p) => p.id),
        restrictionPairs
      );
      await Promise.all(
        assignments.map((pair) =>
          tx.participant.update({
            where: { id: pair.drawerId },
            data: { assignedToId: pair.recipientId }
          })
        )
      );

      return createdGame;
    });

    // Send invites (best-effort; don't fail the request if emails fail)
    const inviteResults: { email: string; status: string; detail?: string }[] = [];
    const mailToken = process.env.MAILTRAP_API_TOKEN || process.env.MAILTRAP_TOKEN;
    const fromEmail = process.env.MAIL_FROM_ADDRESS || "invite@giftswap.site";
    if (mailToken) {
      await Promise.all(
        game.participants.map(async (p) => {
          const link = `${baseUrl}/play/${p.accessToken}`;
          try {
            const resp = await fetch("https://send.api.mailtrap.io/api/send", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${mailToken}`,
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                from: { email: fromEmail, name: hostName },
                to: [{ email: p.email }],
                subject: `${name} — your Secret Santa invite`,
                text: `Hi ${p.name}! ${hostName} invited you to the "${name}" Secret Santa.\nThis Secret Santa app was built by Jacob Kennedy.\n\nYour private link: ${link}\n\nUse this link to reveal your match and add your wishlist.`,
                category: "Secret Santa"
              })
            });

            if (!resp.ok) {
              const detail = await resp.text();
              console.error("Mailtrap send failed", p.email, resp.status, detail);
              inviteResults.push({
                email: p.email,
                status: `failed (${resp.status})`,
                detail
              });
              return;
            }
            inviteResults.push({ email: p.email, status: "sent" });
          } catch (err) {
            console.error("Failed to send invite", p.email, err);
            inviteResults.push({ email: p.email, status: "failed" });
          }
        })
      );
    } else {
      inviteResults.push({ email: "all", status: "skipped (no MAILTRAP_API_TOKEN)" });
    }

    return NextResponse.json({
      id: game.id,
      name: game.name,
      participants: game.participants.map((p) => ({
        id: p.id,
        name: p.name,
        email: p.email,
        hasDrawn: p.hasDrawn,
        wishlist: p.wishlist,
        link: `${baseUrl}/play/${p.accessToken}`
      })),
      invites: inviteResults
    });
  } catch (err) {
    console.error("Failed to create game", err);
    return NextResponse.json(
      { error: "Could not create the game. Please try again." },
      { status: 500 }
    );
  }
}
