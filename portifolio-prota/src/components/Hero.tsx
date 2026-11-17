"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Slide = {
  image: string;
  before: string;
  highlight: string;
  closed: string;
  open: string;
};

// Cada slide entra com uma transição diferente (clip-path)
const slides: Slide[] = [
  {
    image: "/foto1.png",
    before: "Elevamos o seu",
    highlight: "Audiovisual",
    // íris de câmera abrindo do centro
    closed: "circle(0% at 50% 50%)",
    open: "circle(80% at 50% 50%)",
  },
  {
    image: "/foto2.png",
    before: "Entregamos o seu",
    highlight: "Protagonismo",
    // corte diagonal varrendo da esquerda
    closed: "polygon(0 0, 0 0, -25% 100%, -25% 100%)",
    open: "polygon(0 0, 125% 0, 100% 100%, -25% 100%)",
  },
  {
    image: "/foto3.png",
    before: "E te tornamos mais",
    highlight: "Energético",
    // cortina subindo de baixo
    closed: "inset(100% 0 0 0)",
    open: "inset(0 0 0 0)",
  },
];

const TRANSITION_MS = 1200;
const EASE = "ease-[cubic-bezier(.22,1,.36,1)]";

const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

function Words({
  text,
  shown,
  start,
}: {
  text: string;
  shown: boolean;
  start: number;
}) {
  return text.split(" ").map((word, i) => (
    <span
      key={i}
      className="mr-[0.25em] inline-block overflow-hidden py-[0.08em] align-bottom"
    >
      <span
        className={`inline-block transition-transform duration-700 ${EASE}`}
        style={{
          transform: shown ? "translateY(0)" : "translateY(110%)",
          transitionDelay: shown ? `${start + i * 80}ms` : "0ms",
        }}
      >
        {word}
      </span>
    </span>
  ));
}

const corners = [
  "left-0 top-0 border-l-2 border-t-2",
  "right-0 top-0 border-r-2 border-t-2",
  "bottom-0 left-0 border-b-2 border-l-2",
  "bottom-0 right-0 border-b-2 border-r-2",
];

// Destaque em 3 tempos: a palavra sobe vazada (só contorno), é preenchida de
// âmbar da esquerda p/ direita como uma barra de carregamento, e o "visor de
// câmera" fecha o enquadramento em volta. Depois pulsa com brilho de neon.
function Highlight({ text, shown }: { text: string; shown: boolean }) {
  return (
    <span className="relative mt-3 block w-fit px-[0.22em] py-[0.06em] text-[1.15em]">
      <span className="block overflow-hidden py-[0.12em]">
        <span
          className={`block transition-transform duration-700 ${EASE}`}
          style={{
            transform: shown ? "translateY(0)" : "translateY(115%)",
            transitionDelay: shown ? "950ms" : "0ms",
          }}
        >
          <span className={`relative inline-block whitespace-nowrap ${shown ? "hero-glow" : ""}`}>
            {/* camada vazada */}
            <span className="text-transparent [-webkit-text-stroke:2px_#fff]">
              {text}
            </span>
            {/* camada de preenchimento âmbar revelada em varredura */}
            <span
              aria-hidden="true"
              className="absolute inset-0 text-[#D78521] [-webkit-text-stroke:2px_#D78521] transition-[clip-path] duration-[900ms] ease-[cubic-bezier(.65,0,.35,1)]"
              style={{
                clipPath: shown ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
                transitionDelay: shown ? "1500ms" : "0ms",
              }}
            >
              {text}
            </span>
          </span>
        </span>
      </span>

      {/* cantos do visor: encaixam de fora para dentro */}
      {corners.map((c) => (
        <span
          key={c}
          aria-hidden="true"
          className={`absolute size-[0.3em] border-white/80 transition duration-500 ${EASE} ${c}`}
          style={{
            opacity: shown ? 1 : 0,
            transform: shown ? "scale(1)" : "scale(1.8)",
            transitionDelay: shown ? "1700ms" : "0ms",
          }}
        />
      ))}
    </span>
  );
}

const Chevron = ({ dir }: { dir: "left" | "right" }) => (
  <svg
    viewBox="0 0 24 24"
    className="size-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={dir === "left" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
  </svg>
);

const arrowClass =
  "grid size-12 place-items-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md transition duration-300 hover:scale-110 hover:border-transparent hover:bg-white hover:text-[#002147] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D78521]";

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  // sem isso o 1º slide já nasce "aberto" e a animação de entrada não roda
  const [ready, setReady] = useState(false);
  const busy = useRef(false);
  const timer = useRef<number | undefined>(undefined);
  const startX = useRef(0);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setReady(true));
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer.current);
    };
  }, []);

  const goTo = (index: number) => {
    // evita empilhar transições no meio de outra
    if (busy.current || index === current) return;
    busy.current = true;
    setPrev(current);
    setCurrent(index);
    timer.current = window.setTimeout(() => {
      busy.current = false;
      setPrev(null);
    }, TRANSITION_MS);
  };

  const next = () => goTo((current + 1) % slides.length);
  const previous = () => goTo((current - 1 + slides.length) % slides.length);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Destaques da Prota"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") next();
        if (e.key === "ArrowLeft") previous();
      }}
      onPointerDown={(e) => (startX.current = e.clientX)}
      onPointerUp={(e) => {
        const dx = e.clientX - startX.current;
        if (Math.abs(dx) > 60) (dx < 0 ? next : previous)();
      }}
      className="hero relative h-[90vh] min-h-[560px] w-full touch-pan-y overflow-hidden bg-[#00142B] outline-none"
    >
      {slides.map((slide, i) => {
        const isActive = i === current;
        const isPrev = i === prev;
        const shown = isActive || isPrev;
        const textShown = ready && shown;

        return (
          <div
            key={slide.image}
            aria-hidden={!isActive}
            className={`hero-slide absolute inset-0 ${
              isActive
                ? "transition-[clip-path] duration-[1100ms] ease-[cubic-bezier(.77,0,.18,1)]"
                : ""
            }`}
            style={{
              clipPath: shown ? slide.open : slide.closed,
              zIndex: isActive ? 20 : isPrev ? 10 : 0,
            }}
          >
            {/* Imagem preenchendo 100% do slide, com zoom lento */}
            <div className={`absolute inset-0 ${shown ? "hero-zoom" : ""}`}>
              <Image
                src={slide.image}
                alt=""
                fill
                sizes="100vw"
                priority={i === 0}
                className="object-cover object-center brightness-[.8] contrast-110"
              />
            </div>

            {/* Iluminação: degradê da marca + sombra lateral para dar contraste ao texto */}
            <div className="absolute inset-0 bg-linear-to-b from-[#0050AD] to-[#002147] opacity-60 mix-blend-multiply" />
            <div className="absolute inset-0 bg-linear-to-r from-[#00142B]/90 via-[#002147]/55 to-transparent" />
            <div className="absolute inset-0 bg-linear-to-t from-[#00142B]/85 via-transparent to-[#00142B]/35" />

            {/* Texto */}
            <div
              className={`relative z-10 flex h-full items-center px-[5%] pb-24 pt-24 transition-opacity duration-500 ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
            >
              <h2 className="max-w-4xl font-nura text-[clamp(2.25rem,6vw,5.5rem)] font-bold leading-[1.02] text-white drop-shadow-[0_4px_24px_rgba(0,20,43,.5)]">
                <Words text={slide.before} shown={textShown} start={350} />
                <Highlight text={slide.highlight} shown={textShown} />
              </h2>
            </div>
          </div>
        );
      })}

      {/* Grão e vinheta por cima de tudo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-30 opacity-[.16] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-30 bg-[radial-gradient(120%_90%_at_50%_40%,transparent_55%,rgba(0,20,43,.55)_100%)]"
      />

      {/* Controles */}
      <div className="absolute inset-x-0 bottom-0 z-40 flex items-center justify-between px-[5%] pb-6 md:pb-8">
        {/* Sliders: a barra ativa alonga e se preenche; ao terminar, avança */}
        <div className="flex items-center gap-4">
          <span className="w-12 text-sm font-semibold tabular-nums text-white">
            {String(current + 1).padStart(2, "0")}
            <span className="text-white/50"> / {String(slides.length).padStart(2, "0")}</span>
          </span>
          <div className="flex items-center gap-2">
            {slides.map((slide, i) => (
              <button
                key={slide.image}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Ir para o slide ${i + 1}`}
                aria-current={i === current}
                className={`relative h-1.5 overflow-hidden rounded-full bg-white/25 transition-all duration-500 hover:bg-white/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D78521] ${
                  i === current ? "w-16" : "w-6"
                }`}
              >
                {i === current && (
                  <span
                    key={current}
                    onAnimationEnd={next}
                    className="hero-fill absolute inset-0 origin-left rounded-full bg-[#D78521]"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Setas: a seta "próximo" tem um anel que mostra o tempo do slide */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={previous}
            aria-label="Slide anterior"
            className={arrowClass}
          >
            <Chevron dir="left" />
          </button>
          <div className="relative">
            <svg
              viewBox="0 0 56 56"
              className="pointer-events-none absolute -inset-1 size-14 -rotate-90"
              aria-hidden="true"
            >
              <circle cx="28" cy="28" r="26" fill="none" stroke="rgba(255,255,255,.2)" strokeWidth="2" />
              <circle
                key={current}
                className="hero-ring"
                cx="28"
                cy="28"
                r="26"
                fill="none"
                stroke="#D78521"
                strokeWidth="2"
                strokeLinecap="round"
                pathLength={100}
                strokeDasharray={100}
              />
            </svg>
            <button
              type="button"
              onClick={next}
              aria-label="Próximo slide"
              className={arrowClass}
            >
              <Chevron dir="right" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}