const AWS_BUCKET_NAME = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME;
const AWS_REGION = process.env.NEXT_PUBLIC_AWS_REGION;

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8000',
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
                destination: 'http://localhost:8000/:path*'
            }
        ]
    },
};

export default nextConfig;
