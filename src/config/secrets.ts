import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

let loaded = false;

export async function loadConfig(): Promise<void> {
    if (loaded) return;

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
            const response = await client.send(new GetSecretValueCommand({ SecretId: secretName }));
            if (response.SecretString) {
                const secretValues: Record<string, string> = JSON.parse(response.SecretString);
                for (const [key, value] of Object.entries(secretValues)) {
                    // Only set if not already defined — env vars take priority
                    if (process.env[key] === undefined) {
                        process.env[key] = value;
                    }
                }
            }
        } catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            console.warn(`[secrets] Could not load from Secrets Manager: ${msg}`);
        }
    }

    loaded = true;
}

export function getConfig(key: string): string | undefined {
    return process.env[key];
}
