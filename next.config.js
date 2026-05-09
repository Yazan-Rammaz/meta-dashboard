/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  env: {
    REACT_APP_BASE_URL: process.env.REACT_APP_BASE_URL,
    REACT_APP_CLOUD_URL: process.env.REACT_APP_CLOUD_URL,
    REACT_APP_BRAND_ICON_PATH: process.env.REACT_APP_BRAND_ICON_PATH,
    REACT_APP_CATEGORY_ICON_PATH: process.env.REACT_APP_CATEGORY_ICON_PATH,
    REACT_APP_BOUTIQUE_ICON_PATH: process.env.REACT_APP_BOUTIQUE_ICON_PATH,
    REACT_APP_BOUTIQUE_BANNERS_PATH: process.env.REACT_APP_BOUTIQUE_BANNERS_PATH,
    // WhatsApp Integration
    REACT_APP_WHATSAPP_ID: process.env.NEXT_PUBLIC_WHATSAPP_APP_ID,
    REACT_APP_WHATSAPP_CONFIG_ID: process.env.NEXT_PUBLIC_WHATSAPP_CONFIG_ID,
  
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'src': require('path').resolve(__dirname, 'src'),
    };
    return config;
  },
  // Disable source maps in production to prevent 404 errors for map files
  productionBrowserSourceMaps: false,
  reactStrictMode: true,
  swcMinify: true,
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
      }
    ];
  },
}

module.exports = nextConfig
