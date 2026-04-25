import { SecretsManagerClient } from "@aws-sdk/client-secrets-manager";
import { AWS_CONFIG } from "../interface/aws.interface";
import { S3Client } from "@aws-sdk/client-s3";

const secretName = process.env.AWS_SECRET_NAME;

const clientConfig: AWS_CONFIG = {
    region: process.env.AWS_LAMBDA_REGION || "ap-south-1",
};

const accessKeyId = process.env.AWS_LAMBDA_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_LAMBDA_SECRET_ACCESS_KEY;
if (accessKeyId && secretAccessKey) {
    clientConfig.credentials = { accessKeyId, secretAccessKey };
}


export const secretManagerClient = new SecretsManagerClient(clientConfig);
export const s3Client = new S3Client(clientConfig);