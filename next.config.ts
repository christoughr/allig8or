import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['pptxgenjs', 'exceljs', 'docx'],
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
