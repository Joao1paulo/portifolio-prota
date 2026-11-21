"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

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

// ---------------------------------------------------------------------------
// Texto "sendo escrito": cada letra entra em sequência (sobe, desfoca → nítido)
// com um cursor âmbar que salta de letra em letra, passa da linha de apoio para
// a palavra destaque e, no fim, pisca duas vezes e some. O ritmo tem uma
// variação sutil (JITTER) e uma micro-pausa nos espaços, para parecer digitado
// por uma pessoa e não por uma máquina.
// Usa a Web Animations API: recria tudo sempre que o slide entra (shown vira
// true), então reinicia sozinho quando o carrossel volta ao slide.
// ---------------------------------------------------------------------------
const SUPPORT_START = 350; // ms: depois do início da transição do slide
const SUPPORT_STEP = 36; // ms entre letras da linha de apoio
const HIGHLIGHT_STEP = 52; // ms entre letras da palavra destaque (maior, mais marcada)
const JITTER = [0, 14, 4, 22, 8, 18, 2, 12];
const LETTER_EASE = "cubic-bezier(.22,1,.36,1)";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// instante (ms) em que cada letra (sem contar espaços) é "digitada"
function typeTimes(text: string, start: number, step: number) {
  const times: number[] = [];
  let t = start;
  let n = 0;
  Array.from(text).forEach((ch) => {
    if (ch === " ") {
      t += 80; // micro-pausa entre palavras
      return;
    }
    times.push(t);
    t += step + JITTER[n++ % JITTER.length];
  });
  return { times, end: t };
}

// linha do tempo de um slide: linha de apoio → palavra destaque → efeito da palavra
function timeline(before: string, highlight: string) {
  const s = typeTimes(before, SUPPORT_START, SUPPORT_STEP);
  const hStart = s.end + 90;
  const h = typeTimes(highlight, hStart, HIGHLIGHT_STEP);
  return {
    hStart,
    supportHold: hStart - s.times[s.times.length - 1], // cursor segue até a próxima linha
    sweep: h.end + 40, // preenchimento âmbar começa quando a palavra termina de ser escrita
    corners: h.end + 260, // visor fecha o enquadramento
  };
}

const timelines = slides.map((s) => timeline(s.before, s.highlight));

function playTyping(
  letters: (HTMLElement | null)[],
  carets: (HTMLElement | null)[],
  times: number[],
  hold: number,
  blink: boolean,
) {
  const anims: Animation[] = [];
  times.forEach((delay, i) => {
    const letter = letters[i];
    const caret = carets[i];
    if (!letter || !caret) return;

    anims.push(
      letter.animate(
        [
          { opacity: 0, transform: "translateY(.32em)", filter: "blur(6px)" },
          { opacity: 1, transform: "translateY(0)", filter: "blur(0px)" },
        ],
        { duration: 480, delay, easing: LETTER_EASE, fill: "both" },
      ),
    );

    const last = i === times.length - 1;
    if (last && blink) {
      // último cursor: pisca duas vezes e some
      anims.push(
        caret.animate(
          [
            { opacity: 1, offset: 0, easing: "step-end" },
            { opacity: 0, offset: 0.28, easing: "step-end" },
            { opacity: 1, offset: 0.46, easing: "step-end" },
            { opacity: 0, offset: 0.72, easing: "step-end" },
            { opacity: 0, offset: 1 },
          ],
          { duration: hold, delay, fill: "none" },
        ),
      );
    } else {
      // cursor fica na letra até a próxima ser escrita
      const until = last ? delay + hold : times[i + 1];
      anims.push(
        caret.animate([{ opacity: 1 }, { opacity: 1 }], {
          duration: Math.max(until - delay, 1),
          delay,
          fill: "none",
        }),
      );
    }
  });
  return () => anims.forEach((a) => a.cancel());
}

function Typed({
  text,
  shown,
  start,
  step,
  hold,
  blink = false,
  className = "",
}: {
  text: string;
  shown: boolean;
  start: number;
  step: number;
  hold: number;
  blink?: boolean;
  className?: string;
}) {
  const times = useMemo(() => typeTimes(text, start, step).times, [text, start, step]);
  const letters = useRef<(HTMLSpanElement | null)[]>([]);
  const carets = useRef<(HTMLSpanElement | null)[]>([]);

  // layout effect: a animação começa antes do 1º frame, sem "piscar" o texto inteiro
  useIsoLayoutEffect(() => {
    if (!shown || reduced()) return;
    return playTyping(letters.current, carets.current, times, hold, blink);
  }, [shown, times, hold, blink]);

  let idx = -1;
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className={className}>
        {text.split(" ").map((word, wi, all) => (
          <span
            key={wi}
            className={`inline-block whitespace-nowrap ${wi < all.length - 1 ? "mr-[0.28em]" : ""}`}
          >
            {Array.from(word).map((ch) => {
              const i = ++idx;
              return (
                <span key={i} className="relative inline-block">
                  <span
                    ref={(el) => {
                      letters.current[i] = el;
                    }}
                    className="inline-block"
                    style={shown ? undefined : { opacity: 0 }}
                  >
                    {ch}
                  </span>
                  <span
                    ref={(el) => {
                      carets.current[i] = el;
                    }}
                    className="pointer-events-none absolute left-full top-[12%] ml-[0.05em] h-[76%] w-[0.07em] rounded-full bg-[#D78521] opacity-0"
                  />
                </span>
              );
            })}
          </span>
        ))}
      </span>
    </>
  );
}

const corners = [
  "left-0 top-0 border-l-2 border-t-2",
  "right-0 top-0 border-r-2 border-t-2",
  "bottom-0 left-0 border-b-2 border-l-2",
  "bottom-0 right-0 border-b-2 border-r-2",
];

// Palavra destaque (a mesma animação de "Audiovisual" nas três palavras): a palavra
// é escrita vazada (só contorno), é preenchida de âmbar da esquerda p/ direita como
// uma barra de carregamento, e o "visor de câmera" fecha o enquadramento em volta.
// Depois pulsa com brilho de neon.
function HighlightWord({
  text,
  shown,
  start,
  sweep,
  cornersAt,
}: {
  text: string;
  shown: boolean;
  start: number;
  sweep: number;
  cornersAt: number;
}) {
  return (
    <span className="relative mt-3 block w-fit px-[0.22em] py-[0.06em] text-[clamp(2.4rem,7vw,6.5rem)] font-extrabold">
      <span className="block py-[0.12em]">
        <span className={`relative inline-block whitespace-nowrap ${shown ? "hero-glow" : ""}`}>
          {/* camada vazada, escrita letra a letra */}
          <Typed
            text={text}
            shown={shown}
            start={start}
            step={HIGHLIGHT_STEP}
            hold={900}
            blink
            className="text-transparent [-webkit-text-stroke:2px_#fff]"
          />
          {/* camada de preenchimento âmbar revelada em varredura (mesmas letras, alinhadas) */}
          <span
            aria-hidden="true"
            className="absolute inset-0 text-[#D78521] [-webkit-text-stroke:2px_#D78521] transition-[clip-path] duration-[900ms] ease-[cubic-bezier(.65,0,.35,1)]"
            style={{
              // inset negativo em cima/embaixo: o recorte não corta pernas de letras (g, p)
              clipPath: shown ? "inset(-.3em 0 -.3em 0)" : "inset(-.3em 100% -.3em 0)",
              transitionDelay: shown ? `${sweep}ms` : "0ms",
            }}
          >
            {Array.from(text).map((ch, i) => (
              <span key={i} className="inline-block">
                {ch}
              </span>
            ))}
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
            transitionDelay: shown ? `${cornersAt}ms` : "0ms",
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
        const tl = timelines[i];

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

            {/* Texto: setup pequeno (Poppins 500) → palavra destaque grande (Nura 800) */}
            <div
              className={`relative z-10 flex h-full items-center px-[5%] pb-24 pt-24 transition-opacity duration-500 ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
            >
              <h2 className="max-w-4xl font-nura leading-[1.02] text-white drop-shadow-[0_4px_24px_rgba(0,20,43,.5)]">
                <span className="block font-sans text-[clamp(1.1rem,2vw,1.75rem)] font-medium leading-[1.25]">
                  <Typed
                    text={slide.before}
                    shown={textShown}
                    start={SUPPORT_START}
                    step={SUPPORT_STEP}
                    hold={tl.supportHold}
                  />
                </span>
                <HighlightWord
                  text={slide.highlight}
                  shown={textShown}
                  start={tl.hStart}
                  sweep={tl.sweep}
                  cornersAt={tl.corners}
                />
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