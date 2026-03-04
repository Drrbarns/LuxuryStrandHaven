import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Luxury Strand Haven — Premium Wigs & Hair in Ghana';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#0a0a0a',
          fontFamily: 'serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Gold left accent bar */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 6, background: 'linear-gradient(to bottom, #C9A84C, #F5D78E, #C9A84C)', display: 'flex' }} />

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 80px', flex: 1 }}>
          {/* Brand tag */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 28 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#C9A84C', marginRight: 10 }} />
            <span style={{ color: '#C9A84C', fontSize: 16, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'sans-serif', fontWeight: 600 }}>
              Premium Hair Collection · Ghana
            </span>
          </div>

          {/* Headline */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#F5D78E', fontSize: 76, fontWeight: 700, lineHeight: 1.05, marginBottom: 4 }}>
              Luxury
            </span>
            <span style={{ color: '#ffffff', fontSize: 76, fontWeight: 700, lineHeight: 1.05, marginBottom: 4 }}>
              Strand Haven
            </span>
          </div>

          {/* Divider */}
          <div style={{ width: 80, height: 2, background: '#C9A84C', marginTop: 24, marginBottom: 24, display: 'flex' }} />

          {/* Services */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ color: '#e0e0e0', fontSize: 22, fontFamily: 'sans-serif', fontWeight: 400 }}>
              Custom Wigs · Bundles · Closures & Frontals
            </span>
            <span style={{ color: '#a0a0a0', fontSize: 18, fontFamily: 'sans-serif' }}>
              100% Human Hair · HD Lace · Fast Delivery Across Ghana
            </span>
          </div>

          {/* URL */}
          <div style={{ display: 'flex', marginTop: 40 }}>
            <span style={{ color: '#C9A84C', fontSize: 15, fontFamily: 'sans-serif', letterSpacing: '0.05em' }}>
              luxurystrandhaven.com
            </span>
          </div>
        </div>

        {/* Right decorative panel */}
        <div style={{
          width: 380,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)',
          borderLeft: '1px solid #2a2a2a',
          padding: 40,
          gap: 16,
        }}>
          {[
            { emoji: '👑', label: 'Custom Luxury Wigs' },
            { emoji: '✨', label: 'HD Lace Frontals' },
            { emoji: '💫', label: 'Raw Hair Bundles' },
            { emoji: '🎓', label: 'Hair Academia' },
          ].map((item) => (
            <div key={item.label} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              width: '100%',
              padding: '12px 16px',
              background: '#1e1e1e',
              borderRadius: 8,
              border: '1px solid #2a2a2a',
            }}>
              <span style={{ fontSize: 22 }}>{item.emoji}</span>
              <span style={{ color: '#e0e0e0', fontSize: 16, fontFamily: 'sans-serif', fontWeight: 500 }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
