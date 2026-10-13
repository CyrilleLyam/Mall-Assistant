# Mall Assistant

Web app that helps shoppers find stores, promotions, and answers about a shopping mall in Khmer or English. Mall staff use a separate admin area to keep the information up to date.

All data (stores, events, opening hours) is mock data created for this demo.

## Setup

Requires Node 20 or newer.

```bash
cp backend/.env.example backend/.env

cd backend
npm install
npm run migration:generate -- src/shared/infrastructure/database/migrations/Init
npm run migration:run
npm run db:seed
npm run start:dev
```

The API runs on http://localhost:3000 and the Swagger docs on http://localhost:3000/docs. `db:seed` creates the categories and the admin account from `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env`.

The passwords and `JWT_SECRET` in `.env.example` are random values meant for local development only. Every clone shares them, so generate new ones for any deployed environment:

```bash
openssl rand -hex 48
openssl rand -base64 48 | tr -dc 'A-Za-z0-9' | head -c 32
```

Use the first for `JWT_SECRET` and the second for `POSTGRES_PASSWORD` and `ADMIN_PASSWORD`. If you change `POSTGRES_PASSWORD`, change it in `DATABASE_URL` too.


## Scripts

| Where | Command | Purpose |
| --- | --- | --- |
| backend | `npm test` | unit tests |
| backend | `npm run lint` | oxlint with type-aware rules |
| backend | `npm run build` | production build |
| backend | `npm run migration:generate -- <path>` | create a migration from entity changes |
| backend | `npm run migration:run` / `migration:revert` | apply or undo migrations |
| frontend | `npm run build` | type-check and production build |
| frontend | `npm run lint` | oxlint |

## Live demo

To be added after deployment.
