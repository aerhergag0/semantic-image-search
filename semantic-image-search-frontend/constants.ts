import {S3Client} from "@aws-sdk/client-s3";

export const BACKEND_API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;
export const FRONTEND_API_BASE_URL = process.env.NEXT_PUBLIC_FRONTEND_API_BASE_URL;

export const AWS_ACCESS_KEY_ID = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID
export const AWS_SECRET_ACCESS_KEY = process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY
export const AWS_REGION = process.env.NEXT_PUBLIC_AWS_REGION
export const AWS_BUCKET_NAME = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME
export const AWS_BUCKET_LINK = `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com`

export const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!
    },
    region: process.env.NEXT_PUBLIC_AWS_REGION
});