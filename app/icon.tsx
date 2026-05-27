import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          borderRadius: 8,
        }}
      >
        <div
          style={{
            display: 'flex',
            color: '#070b09',
            fontSize: 15,
            fontWeight: 800,
            fontFamily: 'ui-sans-serif, system-ui, sans-serif',
            letterSpacing: -0.5,
            lineHeight: 1,
          }}
        >
          a8
        </div>
      </div>
    ),
    { width: 32, height: 32 }
  );
}
