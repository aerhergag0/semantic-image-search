/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
          {
              protocol: 'http',
              hostname: 'localhost',
              port: '8000',
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
