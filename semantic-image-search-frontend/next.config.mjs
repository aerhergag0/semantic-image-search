const AWS_BUCKET_NAME = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME;
const AWS_REGION = process.env.NEXT_PUBLIC_AWS_REGION;
const BACKEND_API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;
const FRONTEND_API_BASE_URL = process.env.NEXT_PUBLIC_FRONTEND_API_BASE_URL;

const BACKEND_API_HOSTNAME = new URL(BACKEND_API_BASE_URL).hostname;
const BACKEND_API_PORT = new URL(BACKEND_API_BASE_URL).port;

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'http',
                hostname: BACKEND_API_HOSTNAME,
                port: BACKEND_API_PORT,
                pathname: '/*'
            },
            {
                protocol: 'https',
                hostname: BACKEND_API_HOSTNAME,
                port: BACKEND_API_PORT,
                pathname: '/*'
            },
            {
                protocol: "https",
                hostname: `${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com`,
                pathname: '/*'
            }
        ],
    },
    async rewrites() {
        return [
            {
                source: '/:path*',
                destination: `${BACKEND_API_BASE_URL}/:path*`
            }
        ]
    },
};

export default nextConfig;
