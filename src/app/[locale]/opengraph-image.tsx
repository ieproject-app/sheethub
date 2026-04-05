import { ImageResponse } from 'next/og'
import type { Locale } from '@/i18n-config'

export const alt = 'SheetHub - Excel dan Google Sheets: Tutorial, Rumus, dan Update Cepat'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const isId = locale === 'id'

  const tagline = isId
    ? 'Tutorial Excel & Google Sheets, Rumus Praktis, dan Update Cepat'
    : 'Excel and Google Sheets tutorials, practical formulas, and quick updates'

  const accent = '#0F9D58'
  const accentDark = '#217346'

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #102315 0%, #163d25 58%, #102315 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: `linear-gradient(90deg, ${accentDark}, ${accent}, ${accentDark})`,
            display: 'flex',
          }}
        />

        {/* Decorative circle top-right */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            right: -120,
            width: 480,
            height: 480,
            borderRadius: '50%',
            background: `rgba(15, 157, 88, 0.08)`,
            display: 'flex',
          }}
        />

        {/* Decorative circle bottom-left */}
        <div
          style={{
            position: 'absolute',
            bottom: -160,
            left: -160,
            width: 560,
            height: 560,
            borderRadius: '50%',
            background: `rgba(33, 115, 70, 0.08)`,
            display: 'flex',
          }}
        />

        {/* Logo + Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginBottom: 28 }}>
          <div
            style={{
              width: 84,
              height: 84,
              borderRadius: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `linear-gradient(135deg, ${accent}, ${accentDark})`,
              boxShadow: `0 8px 40px rgba(15, 157, 88, 0.45)`,
            }}
          >
            <span style={{ fontSize: 48, fontWeight: 900, color: 'white' }}>S</span>
          </div>
          <span
            style={{
              fontSize: 68,
              fontWeight: 800,
              color: 'white',
              letterSpacing: '-2px',
            }}
          >
            SheetHub
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            display: 'flex',
            fontSize: 26,
            color: '#94a3b8',
            textAlign: 'center',
            maxWidth: 740,
            lineHeight: 1.5,
            marginBottom: 44,
          }}
        >
          {tagline}
        </div>

        {/* Topic chips */}
        <div style={{ display: 'flex', gap: 14 }}>
          {['Excel', 'Google Sheets', 'Formula', 'Automation'].map((tag) => (
            <div
              key={tag}
              style={{
                padding: '10px 24px',
                borderRadius: 100,
                background: 'rgba(15, 157, 88, 0.2)',
                border: '1px solid rgba(15, 157, 88, 0.45)',
                color: '#86efac',
                fontSize: 20,
                fontWeight: 600,
                display: 'flex',
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        {/* URL badge */}
        <div
          style={{
            position: 'absolute',
            bottom: 36,
            right: 52,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: accent,
            fontSize: 20,
            fontWeight: 700,
          }}
        >
          sheethub.web.id
        </div>

        {/* Bottom accent bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 6,
            background: `linear-gradient(90deg, ${accentDark}, ${accent}, ${accentDark})`,
            display: 'flex',
          }}
        />
      </div>
    ),
    { ...size }
  )
}
