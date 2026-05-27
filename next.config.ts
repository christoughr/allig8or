import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // pptxgenjs must be bundled — externalizing breaks on Vercel (ESM import error)
  serverExternalPackages: ['exceljs', 'docx'],
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  async rewrites() {
    return [
      // Browsers request /favicon.ico first — serve our a8 PNG (not the old Next default "A")
      { source: '/favicon.ico', destination: '/icon' },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
  async redirects() {
    const destination = 'https://www.allig8tor.com/:path*';
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'allig8or.com' }],
        destination,
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.allig8or.com' }],
        destination,
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'allig8tor.com' }],
        destination,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
