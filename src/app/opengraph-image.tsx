import { ImageResponse } from 'next/og';

export const alt = 'Admission Pitara — school discovery and admissions in Greater Noida';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '72px',
          background: '#f8fafc',
          color: '#0f172a',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            marginBottom: '34px',
            color: '#0f2d4a',
            fontSize: 30,
            fontWeight: 700,
          }}
        >
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 14,
              background: '#0f2d4a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: 30,
              fontWeight: 900,
            }}
          >
            P
          </div>
          Admission Pitara
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            maxWidth: 980,
          }}
        >
          <div
            style={{
              fontSize: 64,
              lineHeight: 1.05,
              fontWeight: 900,
              letterSpacing: -2,
            }}
          >
            Find the right school
          </div>
          <div
            style={{
              fontSize: 64,
              lineHeight: 1.05,
              fontWeight: 900,
              letterSpacing: -2,
              color: '#0f2d4a',
            }}
          >
            with complete clarity.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: '30px',
            fontSize: 27,
            lineHeight: 1.35,
            color: '#475569',
          }}
        >
          Compare schools, understand fees, explore admissions and build your shortlist.
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: '42px',
            fontSize: 22,
            fontWeight: 700,
            color: '#c2410c',
          }}
        >
          Greater Noida West • Noida Extension
        </div>
      </div>
    ),
    { ...size }
  );
}
