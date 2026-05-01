# KickBi Backend

Fastify + TypeScript backend deployed as an **AWS Lambda** function via SAM, with local dev server support.

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 20.x |
| Framework | Fastify 5 |
| Language | TypeScript (SWC for local, esbuild for Lambda) |
| Database | MongoDB via Mongoose 9 |
| Auth | JWT (`jsonwebtoken`) + Google OAuth (`google-auth-library`) |
| Validation | Joi |
| Serverless | AWS SAM (esbuild bundling) |
| Storage | AWS S3 (presigned URLs via `@aws-sdk/s3-request-presigner`) |
| Secrets | AWS Secrets Manager (local `.env` overrides) |
| Linting | ESLint 10 + Prettier |

## Project Structure

```
├── index.ts                    # Local dev entry point (dotenv + server)
├── src/
│   ├── app.ts                  # Fastify app builder (shared by local & Lambda)
│   ├── server.ts               # Local dev server (listen on localhost:3010)
│   ├── handler.ts              # Lambda handler (fastify.inject)
│   ├── routesSetup.ts          # Route registration + auth middleware hook
│   ├── config/
│   │   ├── aws.ts              # AWS SDK client config
│   │   ├── db.ts               # Mongoose connection
│   │   └── secrets.ts          # AWS Secrets Manager loader
│   ├── constants/
│   │   ├── response.constants.ts
│   │   └── user.constants.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   └── user.controller.ts
│   ├── helpers/
│   │   ├── cryptoHelper.ts     # Password hashing (bcrypt-style)
│   │   ├── dbHelper.ts
│   │   ├── googleOAuthHelper.ts
│   │   ├── jwtHelper.ts
│   │   └── s3Helper.ts
│   ├── interface/              # TypeScript interfaces
│   ├── messages/
│   │   └── response.messages.ts
│   ├── middlewares/
│   │   └── auth.middleware.ts  # JWT verification preHandler
│   ├── models/
│   │   └── users/
│   │       ├── user.model.ts
│   │       └── userAuth.model.ts
│   ├── routes/
│   │   ├── api/v1/
│   │   │   ├── auth.routes.ts  # /api/v1/auth/*
│   │   │   └── user.routes.ts  # /api/v1/user/*
│   │   └── web/
│   │       └── authCallback.route.ts  # /web/auth/*
│   ├── service/
│   │   └── user/
│   │       ├── user.service.ts
│   │       └── userAuth.service.ts
│   ├── utils/
│   │   └── response.ts
│   └── validators/
│       └── auth.validator.ts
├── config/
│   ├── dev.yml
│   └── prod.yml
├── template.yml                # SAM template
├── samconfig.toml              # SAM deploy profiles (dev / stag / prod)
├── nodemon.json                # Nodemon + SWC config
└── .env                        # Local credentials (gitignored)
```

## API Routes

### Auth — `/api/v1/auth` (public)

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/v1/auth/signup` | Register with email & password |
| `POST` | `/api/v1/auth/login` | Login with email & password |

### User — `/api/v1/user` (protected)

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/v1/user/me` | Get authenticated user details |

### Web (OAuth callbacks) — `/web/auth`

| Method | Path | Description |
|---|---|---|
| `GET` | `/web/auth/...` | Google OAuth callback handling |

> All `/api/v1/*` routes pass through the `authMiddleware` preHandler. Public routes (auth) bypass the JWT check internally.

## Prerequisites

- Node.js >= 20
- AWS CLI & SAM CLI
- AWS profiles configured: `kickbi-dev`, `kickbi-stag`, `kickbi-prod`

## Setup

```bash
npm install
```

Copy `.env.example` to `.env` and fill in your credentials.

## Environment Variables

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign/verify JWTs |
| `AWS_SECRET_NAME` | AWS Secrets Manager secret name (optional locally) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `S3_BUCKET_NAME` | S3 bucket for file uploads |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server with hot reload (nodemon + SWC) |
| `npm run build` | Compile TypeScript via SWC to `dist/` |
| `npm run typecheck` | Run TypeScript type checking (no emit) |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Auto-fix lint errors |
| `npm run deploy:dev` | SAM build + deploy to **dev** |
| `npm run deploy:stag` | SAM build + deploy to **staging** |
| `npm run deploy:prod` | SAM build + deploy to **prod** (requires changeset confirmation) |
| `npm run invoke:dev` | Build + invoke Lambda locally via SAM |
| `npm run start-api:dev` | Build + start local SAM API Gateway |
| `npm run remove:dev` | Delete dev CloudFormation stack |
| `npm run remove:stag` | Delete staging CloudFormation stack |
| `npm run remove:prod` | Delete prod CloudFormation stack |

## Local Development

```bash
npm run dev
# Server starts on http://localhost:3010
```

Local `.env` variables take priority over AWS Secrets Manager values.

## Deployment

```bash
npm run deploy:dev    # dev environment
npm run deploy:stag   # staging environment
npm run deploy:prod   # prod environment (prompts for changeset confirmation)
```

All environments deploy to `ap-south-1`. Only `handler.js` (single esbuild bundle) is uploaded — no `.env`, no `node_modules`.

| Environment | Stack | Secret |
|---|---|---|
| dev | `kickbi-backend-dev` | `KickbiDevelopment` |
| stag | *(samconfig stag profile)* | *(stag secret)* |
| prod | `kickbi-backend-prod` | `KickbiProduction` |

## Secrets

The app loads secrets from AWS Secrets Manager at startup:

- `AWS_SECRET_NAME` env var is set via the SAM `SecretName` parameter.
- The Lambda execution role has `secretsmanager:GetSecretValue` for the configured secret.
- The Lambda execution role also has `s3:PutObject`, `s3:GetObject`, `s3:DeleteObject` on `kickbi-{stage}-bucket`.

Locally, individual env vars in `.env` override any Secrets Manager values.

