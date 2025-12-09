# Secret Santa Drawer

Next.js + Prisma + Postgres app to spin up a Secret Santa draw, share a join link, and let people reveal their match with a quick animation.

## Setup
- Copy `.env.example` to `.env` and set `DATABASE_URL` to your Postgres instance.
- Install deps: `npm install`
- Apply schema: `npx prisma migrate dev --name init` (or `npm run prisma:migrate` after shipping migrations).
- Generate Prisma client (if needed): `npm run prisma:generate`
- Start dev server: `npm run dev`

## How it works
- Home (`/`): paste participant names (one per line) and create a game. We pre-assign matches server-side to avoid conflicts.
- Share `game/:id`: each person selects their name. On reveal, they get their recipient and are marked as drawn so nobody else can pick them again.
- API: `POST /api/games` to create a game, `GET /api/games/:id` to view status, `POST /api/games/:id/draw` to reveal a participant’s match.
