import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import { secretManagerClient } from "./aws";

let loaded = false;

export async function loadConfig(): Promise<void> {
    if (loaded) return;

    const secretName = process.env.AWS_SECRET_NAME;

    if (secretName) {
        try {
            const client = secretManagerClient;
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
