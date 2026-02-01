/**
 * Full-page background effects for the sliding interface.
 * Background image, subtle gradients, grid, and soft motion behind all sections.
 */
export function BackgroundEffects() {
  return (
    <div
      className="bg-effects-layer"
      aria-hidden
    >
      {/* Background image — factory / APM dashboard (with dark overlay for readability) */}
      <div
        className="bg-effects-bg-image"
        style={{
          backgroundImage: 'url(/background.png)',
        }}
      />
      <div className="bg-effects-bg-overlay" />

      {/* Base gradient orbs — slow drift for depth */}
      <div className="bg-effects-gradient bg-effects-orb-1" />
      <div className="bg-effects-gradient bg-effects-orb-2" />
      <div className="bg-effects-gradient bg-effects-orb-3" />

      {/* Radial glows — blue (primary) and soft amber (accent) */}
      <div
        className="bg-effects-glow bg-effects-glow-primary"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 20% 10%, rgba(37, 99, 235, 0.18) 0%, transparent 55%)',
        }}
      />
      <div
        className="bg-effects-glow bg-effects-glow-accent"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 85% 90%, rgba(234, 179, 8, 0.06) 0%, transparent 50%)',
        }}
      />

      {/* Subtle grid overlay for tech feel */}
      <div
        className="bg-effects-grid"
        style={{
          backgroundImage: `
            linear-gradient(rgba(37, 99, 235, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(37, 99, 235, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
        }}
      />

      {/* Optional: very soft noise texture (CSS-only approximation via gradient) */}
      <div className="bg-effects-noise" />
    </div>
  );
}
