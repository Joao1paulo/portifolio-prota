"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactElement } from "react";

const O = "#D78521"; // âmbar da marca
const W = "#FFFFFF";

/* ------------------------------------------------------------------ */
/*  ÍCONES — SVG próprio, cada um com sua animação (ativada no hover,  */
/*  foco de teclado ou toque). As animações estão no CSS lá embaixo.   */
/* ------------------------------------------------------------------ */

const svgProps = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: W,
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "h-full w-full overflow-visible",
  "aria-hidden": true,
};

const MINI_HEART =
  "M0 3C-2 1-3 0-3-1C-3-2-2-3-1-3C-.5-3 0-2.6 0-2C0-2.6 .5-3 1-3C2-3 3-2 3-1C3 0 2 1 0 3Z";

/* Gestão de rede social — post/calendário; coração pulsa e curtidas sobem */
function IconSocial() {
  return (
    <svg {...svgProps}>
      <rect x="9" y="9" width="30" height="31" rx="6" />
      <path d="M9 17h30M17 5v7M31 5v7" />
      <path
        className="svc-heart"
        d="M24 34C18 29 15 26 15 22.5C15 20 17 18.5 19 18.5C21 18.5 23 19.5 24 21.5C25 19.5 27 18.5 29 18.5C31 18.5 33 20 33 22.5C33 26 30 29 24 34Z"
        fill={O}
        stroke="none"
      />
      <g transform="translate(38 22)">
        <path className="svc-mini svc-mini-1" d={MINI_HEART} fill={O} stroke="none" />
      </g>
      <g transform="translate(10 24)">
        <path className="svc-mini svc-mini-2" d={MINI_HEART} fill={O} stroke="none" />
      </g>
    </svg>
  );
}

/* Produção audiovisual — câmera de cinema; carretéis giram e REC pisca */
function IconVideo() {
  return (
    <svg {...svgProps}>
      <g className="svc-reel svc-reel-a">
        <circle cx="17" cy="14" r="5.5" />
        <path d="M17 10.5v7M13.5 14h7" />
      </g>
      <g className="svc-reel svc-reel-b">
        <circle cx="31" cy="14" r="5.5" />
        <path d="M31 10.5v7M27.5 14h7" />
      </g>
      <rect x="7" y="22" width="26" height="17" rx="3.5" />
      <path d="M33 28l8-5v16l-8-5z" />
      <circle className="svc-rec" cx="13" cy="28" r="2" fill={O} stroke="none" />
    </svg>
  );
}

/* Fotografia — diafragma que abre/fecha e dispara o flash */
function IconPhoto() {
  const blades = [0, 60, 120, 180, 240, 300];
  return (
    <svg {...svgProps}>
      <circle cx="24" cy="24" r="17" />
      <g className="svc-iris">
        {blades.map((a) => (
          <path key={a} d="M31 24L34.3 11.7" transform={`rotate(${a} 24 24)`} />
        ))}
        <polygon points="31,24 27.5,30.06 20.5,30.06 17,24 20.5,17.94 27.5,17.94" />
      </g>
      <circle cx="24" cy="24" r="2.4" fill={O} stroke="none" />
      <circle className="svc-flash" cx="38" cy="10" r="2.4" fill={O} stroke="none" />
    </svg>
  );
}

/* Design gráfico — ferramenta caneta: a curva é desenhada com o cursor */
function IconDesign() {
  return (
    <svg {...svgProps}>
      <path d="M8 36L11.5 23M40 30L37 19" strokeWidth="1.2" strokeOpacity=".55" />
      <circle cx="11.5" cy="23" r="1.4" fill={W} stroke="none" />
      <circle cx="37" cy="19" r="1.4" fill={W} stroke="none" />
      <path
        className="svc-curve"
        d="M8 36C14 10 30 10 40 30"
        pathLength={100}
        stroke={O}
        strokeWidth="2.6"
      />
      <rect className="svc-anchor-a" x="5.5" y="33.5" width="5" height="5" rx="1" fill="#001634" strokeWidth="1.6" />
      <rect className="svc-anchor-b" x="37.5" y="27.5" width="5" height="5" rx="1" fill="#001634" strokeWidth="1.6" />
      <circle className="svc-nib" cx="8" cy="36" r="2.8" fill={W} stroke={O} strokeWidth="1.6" />
    </svg>
  );
}

/* Edição de vídeos — timeline: playhead corre e os clipes são cortados */
function IconEdit() {
  return (
    <svg {...svgProps}>
      <rect className="svc-clip svc-clip-1" x="8" y="12" width="14" height="6" rx="2" />
      <rect x="25" y="12" width="15" height="6" rx="2" />
      <rect x="8" y="22" width="12" height="6" rx="2" />
      <rect className="svc-clip svc-clip-2" x="24" y="22" width="16" height="6" rx="2" />
      <rect className="svc-clip svc-clip-3" x="8" y="32" width="20" height="6" rx="2" />
      <rect x="31" y="32" width="9" height="6" rx="2" />
      <g className="svc-play">
        <path d="M20 8v34" stroke={O} strokeWidth="2.2" />
        <path d="M16.5 5h7l-3.5 5z" fill={O} stroke="none" />
      </g>
    </svg>
  );
}

/* Consultoria — bússola; a agulha oscila e encontra o norte */
function IconConsult() {
  return (
    <svg {...svgProps}>
      <circle cx="24" cy="24" r="17" />
      <path d="M24 7.5v3M24 37.5v3M7.5 24h3M37.5 24h3" />
      <g className="svc-needle">
        <path d="M24 12L29.5 24H18.5Z" fill={O} stroke="none" />
        <path d="M24 36L29.5 24H18.5Z" strokeWidth="1.6" />
      </g>
      <circle cx="24" cy="24" r="1.8" fill={W} stroke="none" />
    </svg>
  );
}

/* Cobertura de evento — sinal ao vivo: ondas e anel irradiando */
function IconEvent() {
  return (
    <svg {...svgProps}>
      <circle cx="24" cy="24" r="3.4" fill={O} stroke="none" />
      <path className="svc-wave svc-wave-1" d="M18.5 18.5a8 8 0 0 0 0 11" />
      <path className="svc-wave svc-wave-1" d="M29.5 18.5a8 8 0 0 1 0 11" />
      <path className="svc-wave svc-wave-2" d="M14 14a14 14 0 0 0 0 20" />
      <path className="svc-wave svc-wave-2" d="M34 14a14 14 0 0 1 0 20" />
      <circle className="svc-ring" cx="24" cy="24" r="16" stroke={O} strokeWidth="1.5" />
    </svg>
  );
}

/* Identidade visual — amostras de paleta que se abrem em leque */
function IconBrand() {
  return (
    <svg {...svgProps}>
      <g className="svc-fan svc-fan-l">
        <rect x="9" y="12" width="12" height="28" rx="3.5" fill="#05234f" />
      </g>
      <g className="svc-fan svc-fan-r">
        <rect x="27" y="12" width="12" height="28" rx="3.5" fill="#05234f" />
      </g>
      <g className="svc-fan svc-fan-c">
        <rect x="18" y="9" width="12" height="31" rx="3.5" fill={O} />
        <circle cx="24" cy="34" r="1.6" fill="#001634" stroke="none" />
      </g>
    </svg>
  );
}

/* Landing Page — janela do navegador rolando, cursor clica no botão */
function IconLanding() {
  return (
    <svg {...svgProps}>
      <defs>
        <clipPath id="svc-lp-clip">
          <rect x="9" y="19" width="30" height="19" />
        </clipPath>
      </defs>
      <rect x="7" y="8" width="34" height="32" rx="4.5" />
      <path d="M7 17h34" />
      <circle cx="11.5" cy="12.5" r="1" fill={W} stroke="none" />
      <circle cx="15" cy="12.5" r="1" fill={W} stroke="none" />
      <circle cx="18.5" cy="12.5" r="1" fill={O} stroke="none" />
      <g clipPath="url(#svc-lp-clip)">
        <g className="svc-scroll">
          <rect x="11" y="21" width="26" height="7" rx="1.5" />
          <rect className="svc-btn" x="11" y="31" width="11" height="3.5" rx="1.2" fill={O} stroke="none" />
          <rect x="25" y="31" width="12" height="3.5" rx="1.2" strokeWidth="1.5" />
          <rect x="11" y="40" width="26" height="7" rx="1.5" />
        </g>
      </g>
      <path
        className="svc-cursor"
        d="M29 27v9l2.6-2.4 1.8 4 1.8-.8-1.8-4 3.4-.2z"
        fill={W}
        stroke="#001634"
        strokeWidth="1"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  DADOS                                                              */
/* ------------------------------------------------------------------ */

const SERVICES: { title: string; desc: string; Icon: () => ReactElement }[] = [
  {
    title: "Gestão de rede social",
    desc: "Planejamento, calendário editorial e presença ativa que gera comunidade.",
    Icon: IconSocial,
  },
  {
    title: "Produção audiovisual",
    desc: "Roteiro, direção, captação cinematográfica e iluminação de estúdio.",
    Icon: IconVideo,
  },
  {
    title: "Fotografia",
    desc: "Retratos corporativos, produtos, gastronomia e ensaios de marca.",
    Icon: IconPhoto,
  },
  {
    title: "Design gráfico",
    desc: "Criativos de alta conversão, peças de campanha e direção de arte.",
    Icon: IconDesign,
  },
  {
    title: "Edição de vídeos",
    desc: "Cortes dinâmicos, color grading, motion e sound design envolvente.",
    Icon: IconEdit,
  },
  {
    title: "Consultoria",
    desc: "Diagnóstico de comunicação, posicionamento e roteiro de crescimento.",
    Icon: IconConsult,
  },
  {
    title: "Cobertura de evento",
    desc: "Captação multi-câmera, aftermovies e entrega em tempo real.",
    Icon: IconEvent,
  },
  {
    title: "Identidade visual",
    desc: "Logotipo, paleta, tipografia e universo gráfico proprietário da marca.",
    Icon: IconBrand,
  },
  {
    title: "Landing Page",
    desc: "Páginas rápidas, autorais e estratégicas para converter visitantes.",
    Icon: IconLanding,
  },
];

// inclinações alternadas para o ar de "colado à mão"
const TILES = [-5, 4, -3, 3, -4, 5, -3, 4, -5];
const TAGS = [-2, 1.5, -1, 2, -1.5, 1, -2, 1.5, -1];

/* ------------------------------------------------------------------ */
/*  CSS (animações dos ícones + estados de hover/foco/toque)           */
/* ------------------------------------------------------------------ */

const ON = '.svc:is(:hover,:focus-visible,[data-on="true"])';

const css = `
/* ---- estado base ---- */
.svc-tile{transform:rotate(var(--tilt))}
.svc-tag{transform:rotate(var(--tag-tilt))}
.svc-heart{transform-origin:24px 26px}
.svc-mini{transform-origin:0 0;opacity:0}
.svc-reel-a{transform-origin:17px 14px}
.svc-reel-b{transform-origin:31px 14px}
.svc-iris{transform-origin:24px 24px}
.svc-flash{transform-origin:38px 10px;opacity:0}
.svc-curve{stroke-dasharray:100;stroke-dashoffset:0}
.svc-anchor-a{transform-origin:8px 36px}
.svc-anchor-b{transform-origin:40px 30px}
.svc-nib{opacity:0}
.svc-clip-1{transform-origin:8px 12px}
.svc-clip-2{transform-origin:24px 22px}
.svc-clip-3{transform-origin:8px 32px}
.svc-needle{transform-origin:24px 24px;transform:rotate(40deg)}
.svc-ring{transform-origin:24px 24px;opacity:0}
.svc-fan{transform-origin:24px 44px}
.svc-btn{transform-origin:16.5px 32.75px}

/* ---- cartão/ícone ativos ---- */
${ON} .svc-tile{transform:rotate(0deg) scale(1.08);border-color:${O};box-shadow:0 0 0 4px rgba(215,133,33,.18),0 14px 30px rgba(0,0,0,.45)}
${ON} .svc-tag{transform:rotate(0deg) translateX(4px);background:${O}}
${ON} .svc-num{color:${O}}

/* ---- animações dos ícones ---- */
${ON} .svc-heart{animation:svc-heart 1.1s ease-in-out infinite}
${ON} .svc-mini-1{animation:svc-float 1.6s ease-out infinite}
${ON} .svc-mini-2{animation:svc-float 1.6s ease-out .7s infinite}

${ON} .svc-reel{animation:svc-spin 1.2s linear infinite}
${ON} .svc-rec{animation:svc-blink .9s steps(1) infinite}

${ON} .svc-iris{animation:svc-iris 1.8s ease-in-out infinite}
${ON} .svc-flash{animation:svc-flash 1.8s ease-in-out infinite}

${ON} .svc-curve{animation:svc-draw 2.4s linear infinite}
${ON} .svc-nib{animation:svc-nib 2.4s linear infinite}
${ON} .svc-anchor-a{animation:svc-pop-a 2.4s ease-out infinite}
${ON} .svc-anchor-b{animation:svc-pop-b 2.4s ease-out infinite}

${ON} .svc-play{animation:svc-play 2s linear infinite alternate}
${ON} .svc-clip{animation:svc-clip 1.4s ease-in-out infinite}
${ON} .svc-clip-2{animation-delay:.3s}
${ON} .svc-clip-3{animation-delay:.6s}

${ON} .svc-needle{animation:svc-needle 2.6s ease-in-out infinite}

${ON} .svc-wave{animation:svc-wave 1.4s ease-in-out infinite}
${ON} .svc-wave-2{animation-delay:.3s}
${ON} .svc-ring{animation:svc-ring 1.4s ease-out infinite}

${ON} .svc-fan-l{animation:svc-fan-l 1.8s ease-in-out infinite}
${ON} .svc-fan-r{animation:svc-fan-r 1.8s ease-in-out infinite}
${ON} .svc-fan-c{animation:svc-lift 1.8s ease-in-out infinite}

${ON} .svc-scroll{animation:svc-scroll 2.4s ease-in-out infinite}
${ON} .svc-btn{animation:svc-press 2.4s ease-in-out infinite}
${ON} .svc-cursor{animation:svc-cursor 2.4s ease-in-out infinite}

/* ---- keyframes ---- */
@keyframes svc-heart{0%,100%{transform:scale(1)}30%{transform:scale(1.35)}60%{transform:scale(.95)}}
@keyframes svc-float{0%{transform:translateY(6px) scale(.5);opacity:0}30%{opacity:1}100%{transform:translateY(-12px) scale(1.2);opacity:0}}
@keyframes svc-spin{to{transform:rotate(360deg)}}
@keyframes svc-blink{0%{opacity:1}50%{opacity:.1}}
@keyframes svc-iris{0%,100%{transform:rotate(0) scale(1)}50%{transform:rotate(60deg) scale(.62)}}
@keyframes svc-flash{0%,40%,100%{opacity:0;transform:scale(.4)}55%{opacity:1;transform:scale(1.7)}}
@keyframes svc-draw{0%{stroke-dashoffset:100}65%,100%{stroke-dashoffset:0}}
@keyframes svc-nib{
  0%{opacity:1;transform:translate(0,0)}
  16%{transform:translate(6.1px,-14.7px)}
  32%{transform:translate(14.5px,-20.2px)}
  49%{transform:translate(23.6px,-17.2px)}
  65%{opacity:1;transform:translate(32px,-6px)}
  72%,100%{opacity:0;transform:translate(32px,-6px)}
}
@keyframes svc-pop-a{0%{transform:scale(0)}12%{transform:scale(1.3)}20%,100%{transform:scale(1)}}
@keyframes svc-pop-b{0%,55%{transform:scale(0)}68%{transform:scale(1.3)}76%,100%{transform:scale(1)}}
@keyframes svc-play{from{transform:translateX(-8px)}to{transform:translateX(16px)}}
@keyframes svc-clip{0%,100%{transform:scaleX(1)}50%{transform:scaleX(.7)}}
@keyframes svc-needle{
  0%{transform:rotate(40deg)}
  25%{transform:rotate(200deg)}
  50%{transform:rotate(-25deg)}
  70%{transform:rotate(65deg)}
  85%,100%{transform:rotate(40deg)}
}
@keyframes svc-wave{0%,100%{opacity:.25}50%{opacity:1}}
@keyframes svc-ring{0%{transform:scale(.3);opacity:.9}100%{transform:scale(1.6);opacity:0}}
@keyframes svc-fan-l{0%,100%{transform:rotate(0)}40%,70%{transform:rotate(-24deg)}}
@keyframes svc-fan-r{0%,100%{transform:rotate(0)}40%,70%{transform:rotate(24deg)}}
@keyframes svc-lift{0%,100%{transform:translateY(0)}40%,70%{transform:translateY(-3px)}}
@keyframes svc-scroll{0%,100%{transform:translateY(0)}45%,70%{transform:translateY(-7px)}}
@keyframes svc-press{0%,55%,100%{transform:scale(1)}65%{transform:scale(.85)}78%{transform:scale(1.1)}}
@keyframes svc-cursor{0%{transform:translate(9px,8px)}40%,100%{transform:translate(0,0)}}

@media (prefers-reduced-motion: reduce){
  .svc *{animation:none !important}
  .svc-tile,.svc-tag{transition:none !important}
}
`;

/* ------------------------------------------------------------------ */
/*  COMPONENTE                                                         */
/* ------------------------------------------------------------------ */

export default function Servicos() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState<number | null>(null); // toque (mobile)

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // holofote âmbar que segue o cursor dentro do cartão
  const spotlight = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const reveal = (extra = "") =>
    `transition-all duration-700 ease-out motion-reduce:transition-none ${extra} ${
      visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
    }`;

  return (
    <section
      id="servicos"
      ref={sectionRef}
      aria-labelledby="servicos-titulo"
      className="relative overflow-hidden bg-gradient-to-b from-[#0050AD] via-[#003C8C] to-[#002147] px-6 py-24 text-white lg:py-32"
    >
      <style>{css}</style>

      {/* fundo: pontilhado sutil + brilho âmbar */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-[#D78521]/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 bottom-10 h-96 w-96 rounded-full bg-[#0050AD]/40 blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* ============ CABEÇALHO: folha de caderno ============ */}
        <div className={`text-center ${reveal()}`}>
          <div
            className="relative mx-auto w-fit max-w-full"
            style={{ filter: "drop-shadow(0 18px 24px rgba(0,10,40,.45))" }}
          >
            {/* fita adesiva */}
            <span
              aria-hidden
              className="absolute -top-3 left-1/2 z-10 h-6 w-24 -translate-x-1/2 -rotate-3 bg-[#D78521]/85"
              style={{
                clipPath:
                  "polygon(0 0,4% 25%,0 50%,4% 75%,0 100%,100% 100%,96% 75%,100% 50%,96% 25%,100% 0)",
              }}
            />
            <div
              className="relative -rotate-1 bg-white px-10 pb-7 pt-8 sm:px-16"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to bottom, transparent 0 27px, rgba(0,80,173,.14) 27px 28px)",
                clipPath:
                  "polygon(0 3%,6% 0,14% 4%,25% 0,38% 3%,52% 0,66% 4%,80% 1%,92% 4%,100% 0,99% 30%,100% 55%,99% 80%,100% 100%,88% 96%,70% 100%,55% 96%,40% 100%,24% 96%,10% 100%,0 97%,1% 70%,0 45%,1% 20%)",
              }}
            >
              <span
                aria-hidden
                className="absolute inset-y-0 left-5 w-px bg-[#E5533D]/55 sm:left-8"
              />
              <p className="font-[family-name:var(--font-script,cursive)] text-sm italic text-[#0050AD] sm:text-base">
                Tudo o que sua marca precisa em um só estúdio
              </p>
              <h2
                id="servicos-titulo"
                className="mt-1 font-nura text-4xl font-black leading-none text-[#001B44] sm:text-6xl"
              >
                Nossos{" "}
                <span className="relative inline-block font-[family-name:var(--font-script,cursive)] font-bold italic">
                  Serviços
                  <svg
                    aria-hidden
                    viewBox="0 0 200 12"
                    preserveAspectRatio="none"
                    className="absolute -bottom-2 left-0 h-3 w-full overflow-visible"
                  >
                    <path
                      d="M2 8C40 2 120 2 198 6"
                      fill="none"
                      stroke={O}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      pathLength={100}
                      style={{
                        strokeDasharray: 100,
                        strokeDashoffset: visible ? 0 : 100,
                        transition: "stroke-dashoffset 1s ease-out .6s",
                      }}
                    />
                  </svg>
                </span>
              </h2>
            </div>
          </div>

        </div>

        {/* ============ GRADE DE SERVIÇOS ============ */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map(({ title, desc, Icon }, i) => (
            <div
              key={title}
              className={reveal()}
              style={{ transitionDelay: visible ? `${200 + i * 70}ms` : "0ms" }}
            >
              <div
                tabIndex={0}
                data-on={active === i}
                onPointerDown={(e) => {
                  if (e.pointerType === "touch") {
                    setActive((a) => (a === i ? null : i));
                  }
                }}
                onPointerMove={spotlight}
                className="svc group relative flex h-full cursor-pointer gap-4 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-5 outline-none backdrop-blur-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-[#D78521]/60 hover:bg-white/[0.08] hover:shadow-[0_22px_50px_rgba(0,10,40,0.5)] focus-visible:ring-2 focus-visible:ring-[#D78521]"
              >
                {/* holofote */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(260px circle at var(--mx,50%) var(--my,50%), rgba(215,133,33,.22), transparent 70%)",
                  }}
                />

                {/* número */}
                <span className="svc-num absolute right-4 top-3 font-nura text-xs text-white/25 transition-colors duration-300">
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* ícone */}
                <div
                  className="svc-tile relative grid h-[78px] w-[78px] shrink-0 place-items-center rounded-[22px] border-[3px] border-white bg-gradient-to-br from-[#07306B] to-[#001634] p-[16px] shadow-[0_8px_20px_rgba(0,0,0,0.35)] transition-all duration-500 ease-out sm:h-[88px] sm:w-[88px]"
                  style={{ "--tilt": `${TILES[i]}deg` } as CSSProperties}
                >
                  <Icon />
                </div>

                {/* texto */}
                <div className="relative min-w-0 pt-1">
                  <h3
                    className="svc-tag inline-block bg-white px-3 py-1 font-nura text-[15px] leading-tight text-[#001B44] transition-all duration-300"
                    style={
                      {
                        "--tag-tilt": `${TAGS[i]}deg`,
                        clipPath:
                          "polygon(0 6%,8% 0,30% 5%,55% 0,80% 5%,100% 0,99% 50%,100% 100%,70% 95%,45% 100%,20% 94%,0 100%,1% 50%)",
                      } as CSSProperties
                    }
                  >
                    {title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-white/80">
                    {desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}