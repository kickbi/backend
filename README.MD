# KickBi Backend

Fastify + TypeScript backend deployed as an **AWS Lambda** function via SAM, with local dev server support.

## Tech Stack

- **Runtime:** Node.js 20.x
- **Framework:** Fastify 5
- **Language:** TypeScript (compiled with SWC for local, esbuild for Lambda)
- **Serverless:** AWS SAM (esbuild bundling)
- **Secrets:** AWS Secrets Manager (local `.env` overrides)
- **Linting:** ESLint with `typescript-eslint`

## Project Structure

```
├── index.ts              # Local dev entry point (dotenv + server)
├── src/
│   ├── app.ts            # Fastify app builder (shared by local & Lambda)
│   ├── server.ts         # Local dev server (listen on localhost:3010)
│   ├── handler.ts        # Lambda handler (fastify.inject)
│   ├── config/
│   │   └── secrets.ts    # AWS Secrets Manager loader
│   └── routes/
│       ├── test.ts
│       └── test1.ts
├── template.yml          # SAM template
├── samconfig.toml        # SAM deploy profiles (dev / prod)
├── nodemon.json          # Nodemon + SWC config
└── .env                  # Local credentials (gitignored)
```

## Prerequisites

- Node.js >= 20
- AWS CLI & SAM CLI
- esbuild installed globally: `npm install -g esbuild`
- AWS profiles configured: `kickbi-dev`, `kickbi-prod`

## Setup

```bash
npm install
```

Copy `.env.example` to `.env` and fill in your credentials.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server (hot reload via nodemon + SWC) |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run lint` | Run ESLint |
| `npm run deploy:dev` | SAM build + deploy to dev |
| `npm run deploy:prod` | SAM build + deploy to prod |
| `npm run remove:dev` | Delete dev CloudFormation stack |
| `npm run remove:prod` | Delete prod CloudFormation stack |

## Local Development

```bash
npm run dev
# Server starts on http://localhost:3010
```

Local `.env` variables take priority over AWS Secrets Manager values.

## Deployment

```bash
npm run deploy:dev
```

Deploys to `ap-south-1`. Only `handler.js` (single esbuild bundle) is uploaded — no `.env`, no `node_modules`.

**Dev API URL:** `https://r379m9d5hb.execute-api.ap-south-1.amazonaws.com`

Prod deployment requires changeset confirmation.

## Secrets

The app loads secrets from AWS Secrets Manager at startup using:
- `AWS_SECRET_NAME` env var (set via SAM parameter `SecretName`)
- Lambda execution role has `secretsmanager:GetSecretValue` for the secret

Locally, individual env vars in `.env` override any Secrets Manager values.

