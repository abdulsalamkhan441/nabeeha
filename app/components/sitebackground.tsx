/**
 * One fixed background for the whole site, so every section sits on the same
 * surface. Black base, slow-drifting French beige / Rodeo Dust light, four
 * hairline columns (they echo the three-column palette board), a little film
 * grain and a soft vignette. No patterns or motifs.
 * Sections must have NO background of their own so this shows through.
 */
export default function SiteBackground() {
  return (
    <div aria-hidden="true" className="site-bg">
      <div className="site-bg__glow site-bg__glow--a" />
      <div className="site-bg__glow site-bg__glow--b" />
      <div className="site-bg__glow site-bg__glow--c" />

      <div className="mx-auto hidden h-full max-w-[1200px] grid-cols-4 px-6 sm:grid">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`border-l border-[rgba(205,180,158,0.06)] ${
              i === 3 ? "border-r" : ""
            }`}
          />
        ))}
      </div>

      <div className="site-bg__grain" />
      <div className="site-bg__vignette" />
    </div>
  );
}