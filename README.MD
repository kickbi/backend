# KickBi Backend

Express + TypeScript backend that runs as a **local dev server** or as an **AWS Lambda** function via SAM.

## Tech Stack

- **Runtime:** Node.js 20.x
- **Framework:** Express 5
- **Language:** TypeScript (compiled with SWC)
- **Serverless:** AWS SAM + `@codegenie/serverless-express`
- **Linting:** ESLint with `typescript-eslint`
- **Dev Server:** Nodemon with `@swc-node/register`

## Project Structure

```
├── index.ts          # Entry point — routes to server or serverless based on RTE env
├── app.ts            # Express app setup and route registration
├── server.ts         # Local Express server (imports app.ts)
├── serverless.ts     # Lambda handler (imports app.ts)
├── src/
│   └── routes/       # Route modules
├── nodemon.json      # Nodemon + SWC config
├── eslint.config.mjs # ESLint flat config
├── template.yml      # SAM template
├── samconfig.toml    # SAM deploy profiles (dev / prod)
└── .swcrc            # SWC compiler config
```

## Prerequisites

- Node.js >= 20
- AWS CLI & SAM CLI (for deployment)
- AWS profiles configured: `kickbi-dev`, `kickbi-prod`

## Setup

```bash
npm install
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server with nodemon + SWC (hot reload) |
| `npm run build` | Compile TypeScript to `dist/` via SWC |
| `npm run build:watch` | Compile in watch mode |
| `npm run typecheck` | Run TypeScript type checking (no emit) |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint with auto-fix |
| `npm run deploy:dev` | Build and deploy to dev environment |
| `npm run deploy:prod` | Build and deploy to production |
| `npm run invoke:dev` | Invoke Lambda locally with SAM |
| `npm run remove:dev` | Delete dev stack |
| `npm run remove:prod` | Delete prod stack |

## Runtime Modes

The entry point (`index.ts`) checks the `RTE` environment variable:

| `RTE` value | Behavior |
|---|---|
| `lambda` | Exports the serverless handler for AWS Lambda |
| `server` (default) | Starts the Express server on `PORT` (default 3000) |

Nodemon defaults `RTE=server` via `nodemon.json`.

## Deployment

**Dev:**

```bash
npm run deploy:dev
```

**Production:**

```bash
npm run deploy:prod
```

Both deploy to `ap-south-1`. Prod requires changeset confirmation.
