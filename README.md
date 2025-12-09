# Secret Santa Drawer

Next.js + Prisma + Postgres app to spin up a Secret Santa draw, share a join link, and let people reveal their match with a quick animation.

## Setup
- Copy `.env.example` to `.env` and set `DATABASE_URL` to your Postgres instance.
- Add `MAILTRAP_API_TOKEN` (Mailtrap Send API token) and `APP_BASE_URL` (e.g. `http://localhost:3000` or your deployed URL) to `.env`.
- Install deps: `npm install`
- Apply schema: `npx prisma migrate deploy` (or `npx prisma db push` in dev).
- Generate Prisma client (if needed): `npm run prisma:generate`
- Start dev server: `npm run dev`

## How it works
- Home (`/`): enter host name/email, add participants (names + emails), optional no-pair rules, then create. We pre-assign matches server-side to avoid conflicts and restrictions.
- Each participant gets a unique invite link via email (Mailtrap) and can only reveal from that link at `/play/:token`. They also save a wish list visible only to their Santa.
- Host dashboard (`/game/:id`): view status and copy invite links.
- API: `POST /api/games` to create a game (sends emails), `POST /api/play/:token/draw` to reveal via invite, `POST /api/play/:token/wishlist` to save wish lists, `GET /api/games/:id` for host view.
