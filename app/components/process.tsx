"use client";

import React, { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { Glow, Watermark, displayFont } from "./ui";

/* ------------------------------------------------------------------ */
/* CONTENT                                                             */
/* Photos are hot-linked from Unsplash (free under the Unsplash        */
/* License, nothing to download). To swap one: open any photo on       */
/* unsplash.com, right-click the image, "Copy image address", and      */
/* paste the part that starts with  photo-  into `photo`.              */
/* ------------------------------------------------------------------ */
type Step = {
  label: string; // short word written on the clock face
  title: string;
  text: string;
  gets: string; // what the client ends up with
  tools: string[];
  photo: string;
};

const STEPS: Step[] = [
  {
    label: "Discover",
    title: "Listen first",
    text: "Understand the goal, the audience and the limits of the project before anything is drawn or built.",
    gets: "A clear brief everyone agrees on",
    tools: ["Calls", "Notes", "Questions"],
    photo: "photo-1629904853893-c2c8981a1dc5",
  },
  {
    label: "Plan",
    title: "Map the work",
    text: "Break the idea into pages, features and a realistic order of delivery, so there are no surprises later.",
    gets: "Scope and a timeline",
    tools: ["Sitemaps", "Task boards"],
    photo: "photo-1498050108023-c5249f4df085",
  },
  {
    label: "Design",
    title: "Shape the interface",
    text: "Layout, type, colour and motion are decided together, so the design is something that can really be built.",
    gets: "A visual direction and style guide",
    tools: ["Wireframes", "Prototypes", "Style guide"],
    photo: "photo-1547658719-da2b51169166",
  },
  {
    label: "Structure",
    title: "Lay the foundations",
    text: "Semantic markup and accessible structure come first, so every screen works with a keyboard and a screen reader.",
    gets: "An accessible base for every page",
    tools: ["Semantic HTML", "ARIA", "CSS"],
    photo: "photo-1542831371-29b0f74f9713",
  },
  {
    label: "Build",
    title: "Build the interface",
    text: "Reusable components, responsive from the smallest phone to a wide desktop, with motion that explains rather than decorates.",
    gets: "A fast, responsive front-end",
    tools: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    photo: "photo-1619410283995-43d9134e7656",
  },
  {
    label: "Connect",
    title: "Wire up the back-end",
    text: "APIs, data and server logic that turn a good-looking design into a product that actually works end to end.",
    gets: "Real data behind the screens",
    tools: ["Node.js", "REST APIs", "Databases"],
    photo: "photo-1461749280684-dccba630e2f6",
  },
  {
    label: "Test",
    title: "Test and refine",
    text: "Check every screen size, browser and way of interacting, and fix what feels rough before anyone else sees it.",
    gets: "A build that has been checked, not hoped for",
    tools: ["Responsive checks", "Accessibility checks", "Code review"],
    photo: "photo-1607799279861-4dd421887fb3",
  },
  {
    label: "Launch",
    title: "Launch and support",
    text: "Ship it, watch how it behaves in the real world, and keep improving it after day one.",
    gets: "A live product and a plan for what's next",
    tools: ["Git & GitHub", "Deployment"],
    photo: "photo-1618477388954-7852f32655ec",
  },
];

const COPY = {
  title: "How the work gets done",
  sub: "Eight steps, from the first conversation to launch.",
};

const N = STEPS.length;
const DEG = 360 / N;
const STEP_MS = 4800;
const mod = (n: number, m: number) => ((n % m) + m) % m;
const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=520&h=520&q=70`;

/* ------------------------------------------------------------------ */
/* WHEEL GEOMETRY (SVG viewBox 600 x 600, centre 300,300)              */
/* Step 1 sits at 12 o'clock; each wedge is 45 degrees wide.           */
/* ------------------------------------------------------------------ */
const C = 300;
const R_OUT = 292;
const R_IN = 168;
const R_FACE = 160;
const R_LABEL = 124;

const polar = (deg: number, r: number): [number, number] => {
  const a = (deg * Math.PI) / 180;
  return [C + r * Math.sin(a), C - r * Math.cos(a)];
};

const wedgePath = (a0: number, a1: number) => {
  const [x0, y0] = polar(a0, R_OUT);
  const [x1, y1] = polar(a1, R_OUT);
  const [x2, y2] = polar(a1, R_IN);
  const [x3, y3] = polar(a0, R_IN);
  return `M${x0},${y0} A${R_OUT},${R_OUT} 0 0 1 ${x1},${y1} L${x2},${y2} A${R_IN},${R_IN} 0 0 0 ${x3},${y3} Z`;
};

/* Fine dial ticks drawn on a separate, slightly larger SVG behind the wheel */
function DialTicks() {
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      className="pointer-events-none absolute -inset-[6%] h-[112%] w-[112%]"
    >
      <circle cx="50" cy="50" r="49.6" fill="none" stroke="rgba(205,180,158,0.25)" strokeWidth="0.15" />
      {Array.from({ length: 60 }, (_, i) => {
        const major = i % 5 === 0;
        const a = (i * 6 * Math.PI) / 180;
        const r1 = 49.2;
        const r2 = major ? 47.2 : 48.2;
        return (
          <line
            key={i}
            x1={50 + r1 * Math.sin(a)}
            y1={50 - r1 * Math.cos(a)}
            x2={50 + r2 * Math.sin(a)}
            y2={50 - r2 * Math.cos(a)}
            stroke={major ? "rgba(218,198,178,0.7)" : "rgba(205,180,158,0.3)"}
            strokeWidth={major ? 0.3 : 0.15}
          />
        );
      })}
    </svg>
  );
}

/* Classy champagne clock hands, drawn as slim lances with a tail.
   Each hand is a small SVG laid on the wheel with its pivot at the centre
   (viewBox units match the 600 x 600 wheel, so sizes stay in proportion). */
const HAND_W = 28;
const HAND_H = 320; // pivot sits at y = 160

function Hand({
  angle,
  kind,
  reduce,
}: {
  angle: number;
  kind: "minute" | "hour";
  reduce: boolean;
}) {
  return (
    <motion.div
      aria-hidden="true"
      initial={false}
      animate={{ rotate: angle }}
      transition={
        reduce ? { duration: 0 } : { type: "spring", stiffness: 70, damping: 13, mass: 1 }
      }
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: `${(HAND_W / 600) * 100}%`,
        height: `${(HAND_H / 600) * 100}%`,
        marginLeft: `-${(HAND_W / 2 / 600) * 100}%`,
        marginTop: `-${(HAND_H / 2 / 600) * 100}%`,
        originX: 0.5,
        originY: 0.5,
        willChange: "transform",
      }}
    >
      <svg viewBox={`0 0 ${HAND_W} ${HAND_H}`} className="h-full w-full overflow-visible">
        {kind === "minute" ? (
          <g fill="url(#hand-metal)" stroke="var(--fb-900)" strokeWidth="0.4">
            {/* long needle with a slim lance partway along */}
            <path d="M14 10 L16.2 46 Q17.8 72 16.2 98 L15.2 104 L15.1 160 L12.9 160 L12.8 104 L11.8 98 Q10.2 72 11.8 46 Z" />
            {/* tail with a small diamond counterweight */}
            <path d="M13.2 160 H14.8 V178 H13.2 Z" />
            <path d="M14 176 L16.6 191 L14 206 L11.4 191 Z" />
          </g>
        ) : (
          <g fill="url(#hand-metal)" stroke="var(--fb-900)" strokeWidth="0.4">
            {/* shorter hand: an open, skeleton spade */}
            <path d="M14 56 C19.4 78 22.8 98 18.8 124 L15.4 150 L15.2 160 L12.8 160 L12.6 150 L9.2 124 C5.2 98 8.6 78 14 56 Z" />
            <path
              d="M14 72 C17.2 88 18.8 102 16.2 120 L14 138 L11.8 120 C9.2 102 10.8 88 14 72 Z"
              fill="var(--fb-900)"
              stroke="none"
              opacity="0.9"
            />
            <path d="M13.3 160 H14.7 V172 H13.3 Z" />
            <path d="M14 170 L16 181 L14 192 L12 181 Z" />
          </g>
        )}
      </svg>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* MAIN                                                                */
/* ------------------------------------------------------------------ */
export default function ProcessClock() {
  const reduce = !!useReducedMotion();
  const [tick, setTick] = useState(0); // counts up forever, so the hands never spin backwards
  const [playing, setPlaying] = useState(true);
  const [hovering, setHovering] = useState(false);
  const elapsed = useRef(0);
  const prog = useMotionValue(0);

  const active = mod(tick, N);
  const step = STEPS[active];

  const goTo = (t: number) => {
    elapsed.current = 0;
    prog.set(0);
    setTick(t);
  };
  const selectStep = (i: number) => {
    const delta = mod(i - active + N / 2, N) - N / 2; // shortest way round
    goTo(tick + delta);
  };

  // One clock drives both the hands and the progress bar, so they never drift apart
  useAnimationFrame((_, delta) => {
    if (reduce || !playing || hovering) return;
    elapsed.current += Math.min(delta, 100);
    prog.set(Math.min(1, elapsed.current / STEP_MS));
    if (elapsed.current >= STEP_MS) goTo(tick + 1);
  });

  return (
    <section
      id="process"
      aria-labelledby="process-title"
      className="relative overflow-hidden px-4 py-24 text-[var(--text-white)] sm:px-6 sm:py-32"
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => setHovering(false)}
      onFocus={() => setHovering(true)}
      onBlur={() => setHovering(false)}
    >
      <div className="hairline absolute inset-x-0 top-0" />
      <Watermark className="right-[-2vw] top-16 text-[28vw] sm:top-10 lg:text-[18vw]">Process</Watermark>
      <Glow className="left-[-18%] top-1/2 h-[760px] w-[760px] -translate-y-1/2" strength={0.2} />
      <Glow className="bottom-[-10%] right-[-10%] h-[520px] w-[520px]" strength={0.14} />

      <div className="relative mx-auto max-w-[1200px]">
        <div className="mb-12 max-w-xl sm:mb-16">
          <h2
            id="process-title"
            className="text-5xl leading-[1.1] sm:text-6xl"
            style={displayFont}
          >
            <span className="text-sheen">{COPY.title}</span>
          </h2>
          <p className="mt-4 text-[var(--light-400)]">{COPY.sub}</p>
        </div>

        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-10">
          {/* ------------------------- THE CLOCK ------------------------- */}
          <div className="relative mx-auto aspect-square w-[min(82vw,600px)]">
            <DialTicks />

            <svg
              viewBox="0 0 600 600"
              className="absolute inset-0 h-full w-full"
              aria-hidden="true"
            >
              <defs>
                <radialGradient id="clock-face" cx="50%" cy="38%" r="75%">
                  <stop offset="0%" style={{ stopColor: "var(--fb-500)" }} />
                  <stop offset="55%" style={{ stopColor: "var(--fb-800)" }} />
                  <stop offset="100%" style={{ stopColor: "var(--dark-200)" }} />
                </radialGradient>
                <linearGradient id="wedge-base" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" style={{ stopColor: "var(--fb-800)" }} />
                  <stop offset="100%" style={{ stopColor: "var(--dark-300)" }} />
                </linearGradient>
                {STEPS.map((_, i) => (
                  <clipPath id={`wedge-clip-${i}`} key={i}>
                    <path d={wedgePath(i * DEG - DEG / 2, i * DEG + DEG / 2)} />
                  </clipPath>
                ))}
              </defs>

              <circle cx={C} cy={C} r={R_OUT + 4} fill="none" stroke="var(--glass-border)" strokeWidth="1" />

              {/* Photo wedges */}
              {STEPS.map((s, i) => {
                const a = i * DEG;
                const d = wedgePath(a - DEG / 2, a + DEG / 2);
                const [cx, cy] = polar(a, (R_IN + R_OUT) / 2);
                const [ox, oy] = polar(a, 10).map((v) => v - C);
                const isActive = i === active;
                return (
                  <motion.g
                    key={s.label}
                    initial={false}
                    animate={{ x: isActive ? ox : 0, y: isActive ? oy : 0 }}
                    transition={
                      reduce ? { duration: 0 } : { type: "spring", stiffness: 140, damping: 18 }
                    }
                    onClick={() => selectStep(i)}
                    style={{ cursor: "pointer" }}
                  >
                    <path d={d} fill="url(#wedge-base)" />
                    <g clipPath={`url(#wedge-clip-${i})`}>
                      <image
                        href={img(s.photo)}
                        x={cx - 130}
                        y={cy - 130}
                        width="260"
                        height="260"
                        preserveAspectRatio="xMidYMid slice"
                      />
                    </g>
                    {/* warm tint so every photo shares the palette */}
                    <path d={d} fill="var(--fb-700)" opacity="0.32" style={{ mixBlendMode: "multiply", pointerEvents: "none" }} />
                    <motion.path
                      d={d}
                      fill="#000"
                      initial={false}
                      animate={{ opacity: isActive ? 0 : 0.55 }}
                      transition={{ duration: reduce ? 0 : 0.5 }}
                      style={{ pointerEvents: "none" }}
                    />
                    <path d={d} fill="none" stroke="#000" strokeWidth="5" />
                    <motion.path
                      d={d}
                      fill="none"
                      stroke="var(--rd-300)"
                      strokeWidth="2"
                      initial={false}
                      animate={{ opacity: isActive ? 1 : 0 }}
                      transition={{ duration: reduce ? 0 : 0.4 }}
                      style={{ pointerEvents: "none" }}
                    />
                  </motion.g>
                );
              })}

              {/* Clock face */}
              <circle
                cx={C}
                cy={C}
                r={R_FACE}
                fill="url(#clock-face)"
                stroke="var(--rd-400)"
                strokeWidth="2"
              />
              <circle
                cx={C}
                cy={C}
                r={R_FACE - 14}
                fill="none"
                stroke="var(--rd-200)"
                strokeOpacity="0.28"
                strokeWidth="1"
              />

              {/* Step names around the rim of the face */}
              {STEPS.map((s, i) => {
                const a = i * DEG;
                const [x, y] = polar(a, R_LABEL);
                const rot = a > 90 && a < 270 ? a + 180 : a; // keep the lower labels readable
                return (
                  <text
                    key={s.label}
                    transform={`translate(${x} ${y}) rotate(${rot})`}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="20"
                    letterSpacing="1"
                    style={{
                      fontFamily: "var(--font-body), Georgia, serif",
                      fontStyle: "italic",
                      fill: i === active ? "var(--rd-100)" : "var(--light-500)",
                      transition: "fill 0.4s",
                    }}
                  >
                    {s.label}
                  </text>
                );
              })}
            </svg>

            {/* Hands: the long one points at the current step, the short one at the last */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{ filter: "drop-shadow(3px 5px 4px rgba(0,0,0,0.55))" }}
            >
              <Hand angle={(tick - 1) * DEG} kind="hour" reduce={reduce} />
              <Hand angle={tick * DEG} kind="minute" reduce={reduce} />
            </div>

            {/* Metal and pearl at the centre, plus three small dots below it */}
            <svg
              viewBox="0 0 600 600"
              className="pointer-events-none absolute inset-0 h-full w-full"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="hand-metal" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" style={{ stopColor: "var(--fb-400)" }} />
                  <stop offset="35%" style={{ stopColor: "var(--rd-100)" }} />
                  <stop offset="65%" style={{ stopColor: "var(--rd-400)" }} />
                  <stop offset="100%" style={{ stopColor: "var(--fb-500)" }} />
                </linearGradient>
                <radialGradient id="pearl" cx="35%" cy="30%" r="75%">
                  <stop offset="0%" style={{ stopColor: "var(--light-100)" }} />
                  <stop offset="55%" style={{ stopColor: "var(--rd-300)" }} />
                  <stop offset="100%" style={{ stopColor: "var(--fb-400)" }} />
                </radialGradient>
              </defs>
              <circle cx={C} cy={C} r="15" fill="url(#hand-metal)" stroke="var(--fb-900)" strokeWidth="1.5" />
              <circle cx={C} cy={C} r="9.5" fill="var(--fb-900)" />
              <circle cx={C} cy={C} r="7" fill="url(#pearl)" />
              <circle cx={C - 2} cy={C - 2.2} r="1.8" fill="#fff" opacity="0.9" />
              {[-16, 0, 16].map((dx) => (
                <circle key={dx} cx={C + dx} cy={C + 104} r="2.6" fill="var(--rd-400)" opacity="0.85" />
              ))}
            </svg>
          </div>

          {/* ------------------------- THE DETAILS ------------------------- */}
          <div className="glass space-y-7 rounded-3xl p-6 sm:p-9">
            <div
              className="min-h-[19rem] sm:min-h-[20rem]"
              aria-live={playing && !hovering ? "off" : "polite"}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={reduce ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-5"
                >
                  <p className="text-sm font-semibold text-[var(--fb-300)]">
                    Step {active + 1} of {N}
                  </p>
                  <h3
                    className="text-4xl leading-[1.15] text-[var(--text-white)] sm:text-5xl"
                    style={displayFont}
                  >
                    {step.title}
                  </h3>
                  <p className="max-w-md leading-relaxed text-[var(--light-300)]">
                    {step.text}
                  </p>
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-[var(--fb-300)]">What you get</p>
                    <p className="text-sm text-[var(--light-200)]">{step.gets}</p>
                  </div>
                  <ul className="flex flex-wrap gap-2">
                    {step.tools.map((t) => (
                      <li key={t} className="chip">
                        {t}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Timer bar */}
            <div
              aria-hidden="true"
              className="h-[2px] w-full overflow-hidden rounded-full bg-[var(--dark-500)]"
            >
              <motion.div
                className="h-full origin-left bg-gradient-to-r from-[var(--fb-500)] to-[var(--rd-200)]"
                style={{ scaleX: prog }}
              />
            </div>

            {/* Controls and step picker */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => goTo(tick - 1)}
                  aria-label="Previous step"
                  className="icon-btn h-10 w-10"
                >
                  <ChevronLeft size={18} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setPlaying((p) => !p)}
                  aria-label={playing ? "Pause the clock" : "Play the clock"}
                  className="icon-btn h-10 w-10 !border-[var(--rd-400)]"
                >
                  {playing ? (
                    <Pause size={16} aria-hidden="true" />
                  ) : (
                    <Play size={16} aria-hidden="true" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => goTo(tick + 1)}
                  aria-label="Next step"
                  className="icon-btn h-10 w-10"
                >
                  <ChevronRight size={18} aria-hidden="true" />
                </button>
              </div>

              <div role="group" aria-label="Choose a step" className="flex flex-wrap gap-1.5">
                {STEPS.map((s, i) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => selectStep(i)}
                    aria-label={`Step ${i + 1}: ${s.title}`}
                    aria-current={i === active ? "step" : undefined}
                    className={`h-9 w-9 rounded-full border text-xs transition-colors ${
                      i === active
                        ? "border-[var(--rd-300)] bg-[var(--fb-500)] font-semibold text-black"
                        : "border-[var(--glass-border)] text-[var(--light-400)] hover:border-[var(--fb-400)]"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}