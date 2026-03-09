/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
            },
        ],
    },
    trailingSlash: false,
    env: {
        NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
        NEXT_PUBLIC_CLOUD_URL: process.env.NEXT_PUBLIC_CLOUD_URL,
        NEXT_PUBLIC_BRAND_ICON_PATH: process.env.NEXT_PUBLIC_BRAND_ICON_PATH,
        NEXT_PUBLIC_CATEGORY_ICON_PATH: process.env.NEXT_PUBLIC_CATEGORY_ICON_PATH,
        NEXT_PUBLIC_BOUTIQUE_ICON_PATH: process.env.NEXT_PUBLIC_BOUTIQUE_ICON_PATH,
        NEXT_PUBLIC_BOUTIQUE_BANNERS_PATH: process.env.NEXT_PUBLIC_BOUTIQUE_BANNERS_PATH,
    },
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
