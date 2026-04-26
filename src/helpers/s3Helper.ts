import { GetObject$, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../config/aws";
import axios from "axios";
import * as RESPONSE_MESSAGES from "../messages/response.messages";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const uploadFileToS3UsingFileUrl = async function(fileUrl: string, userId: string, pathName: string, fileName: string, mimeType?: string) {
    const Key = `users/${userId}/${pathName}/${fileName}`;
    
    try {

        const fileResponse = await axios.get(fileUrl, { responseType: "arraybuffer" });

        await s3Client.send(new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key,
            Body: fileResponse.data,
            ContentType: mimeType || String(fileResponse.headers["Content-Type"] || "application/octet-stream"),
        }));

        const url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${Key}`;
        const signedUrl = await getS3FileUrl(Key);

        return {
            key: Key,
            url: url,
            signedUrl: signedUrl,
        };
    } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        throw new Error(RESPONSE_MESSAGES.S3_FILE_UPLOAD_FAILED + ": " + msg);
    }
}



export const getS3FileUrl = async function(key: string) {
    if (!process.env.AWS_S3_BUCKET_NAME) {
        throw new Error(RESPONSE_MESSAGES.S3_BUCKET_NAME_NOT_CONFIGURED);
    }
    
    const command = new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return signedUrl;
};

