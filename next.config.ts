import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    poweredByHeader: false,
    compress: true,

    outputFileTracingExcludes: {
        '*': [
            'node_modules/@swc/core-linux-x64-gnu',
            'node_modules/@swc/core-linux-x64-musl',
        ],
    },

    images: {
        formats: ['image/avif', 'image/webp'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },

    experimental: {
        optimizeCss: true,
        optimizeServerReact: true,
    },
};

export default nextConfig;