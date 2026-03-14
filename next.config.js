/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
            },
        ],
    },
    trailingSlash: false,
    // Disable source maps in production to prevent 404 errors for map files
    productionBrowserSourceMaps: false,
    reactStrictMode: true,
    // Add rewrites to handle client-side routing
    async rewrites() {
        return [
            {
                source: '/dashboards/:path*',
                destination: '/',
            },
            {
                source: '/login',
                destination: '/',
            },
            {
                source: '/overview',
                destination: '/',
            },
        ];
    },
};

module.exports = nextConfig;
