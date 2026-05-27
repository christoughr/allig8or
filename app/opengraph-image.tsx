import { ImageResponse } from 'next/og';
import { SITE_NAME, SITE_TAGLINE } from '@/lib/site';

export const runtime = 'edge';
export const alt = 'allig8or — AI Office Suite';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 80,
          background: 'linear-gradient(135deg, #070b09 0%, #0f1f18 50%, #070b09 100%)',
          color: '#fff',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 600,
            color: '#34d399',
            marginBottom: 24,
          }}
        >
          {SITE_TAGLINE}
        </div>
        <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.05, maxWidth: 900 }}>
          {SITE_NAME}
        </div>
        <div style={{ fontSize: 32, color: '#a1a1aa', marginTop: 32, maxWidth: 800 }}>
          Websites · Presentations · Spreadsheets · Documents · PDFs — from one prompt
        </div>
      </div>
    ),
    { ...size }
  );
}
