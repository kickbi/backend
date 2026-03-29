import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

let cachedConfig: Record<string, string> | null = null;

export async function loadConfig(): Promise<Record<string, string>> {
  if (cachedConfig) return cachedConfig;

  let secretValues: Record<string, string> = {};
    const secretName = process.env.AWS_SECRET_NAME;

  if (secretName) {
    try {
      const clientConfig: ConstructorParameters<typeof SecretsManagerClient>[0] = {
        region: process.env.AWS_LAMBDA_REGION || "ap-south-1",
      };

      // Use explicit credentials from .env when available (local dev)
      const accessKeyId = process.env.AWS_LAMBDA_ACCESS_KEY_ID;
      const secretAccessKey = process.env.AWS_LAMBDA_SECRET_ACCESS_KEY;
      if (accessKeyId && secretAccessKey) {
        clientConfig.credentials = { accessKeyId, secretAccessKey };
      }

      const client = new SecretsManagerClient(clientConfig);
      const response = await client.send(
        new GetSecretValueCommand({ SecretId: secretName })
      );
      if (response.SecretString) {
        secretValues = JSON.parse(response.SecretString);
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.warn(`[secrets] Could not load from Secrets Manager: ${msg}`);
    }
  }

  // Environment variables override Secrets Manager values
  // In local dev: .env values (loaded via dotenv) take priority
  // In Lambda: Lambda env vars take priority
  cachedConfig = { ...secretValues };
  for (const [key, value] of Object.entries(process.env)) {
    if (value !== undefined) {
      cachedConfig[key] = value;
    }
  }

  return cachedConfig;
}

export function getConfig(key: string): string | undefined {
  return cachedConfig?.[key];
}
