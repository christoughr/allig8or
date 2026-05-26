import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // pptxgenjs must be bundled — externalizing breaks on Vercel (ESM import error)
  serverExternalPackages: ['exceljs', 'docx'],
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
