"use client";

import { useEffect, useRef, useState } from "react";

const BASE_ROTATE = -3; // inclinação padrão da polaroid (graus)

/*
  Stickers de fundo. Medidas em % da seção:
  - w / left / top  = desktop (lg+). Negativos ou >100 são cortados pela borda
  - m               = versão mobile (opcional). Sem "m" o sticker só aparece no desktop
  - rotate          = inclinação base (graus)
  - depth           = intensidade do parallax com o mouse (px). Maior = "mais perto"
  - dur / delay     = ciclo e atraso da flutuação (s), diferentes para não sincronizar
  - amp / tilt      = amplitude da flutuação (px) e balanço extra (graus)
*/
type Sticker = {
  src: string;
  w: number;
  left: number;
  top: number;
  rotate?: number;
  depth: number;
  dur: number;
  delay: number;
  amp: number;
  tilt: number;
  m?: { w: number; left: number; top: number };
};

const STICKERS: Sticker[] = [
  // topo esquerdo (cortado) — aponta para a polaroid
  { src: "/stickers/mao-apontando.png", w: 11.5, left: -1, top: -1, depth: 22, dur: 7, delay: 0, amp: 8, tilt: 2, m: { w: 30, left: -8, top: -1 } },
  { src: "/stickers/camera.png", w: 6.8, left: 10.6, top: 13.5, depth: 12, dur: 6, delay: -2, amp: 10, tilt: 3 },
  { src: "/stickers/claquete.png", w: 9.5, left: 4.8, top: 37.5, depth: 16, dur: 8, delay: -4, amp: 9, tilt: -2 },
  // base esquerda (cortado)
  { src: "/stickers/filmagem.png", w: 16, left: 1, top: 72, depth: 26, dur: 9, delay: -1, amp: 7, tilt: 1.5 },
  // topo direito
  { src: "/stickers/notebook.png", w: 12.2, left: 82.3, top: 7.8, depth: 18, dur: 7.5, delay: -3, amp: 9, tilt: -2, m: { w: 34, left: 70, top: 2 } },
  { src: "/stickers/coroa.png", w: 8.2, left: 90.3, top: 42, depth: 10, dur: 6.5, delay: -5, amp: 12, tilt: 4, m: { w: 20, left: 84, top: 46 } },
  // base direita (cortado)
  { src: "/stickers/lampada.png", w: 17, left: 84.5, top: 64.5, depth: 24, dur: 8.5, delay: -2.5, amp: 8, tilt: -1.5, m: { w: 36, left: 68, top: 90 } },
];

export default function NossaCausa() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  // Entrada suave quando a seção aparece na tela
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
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Parallax dos stickers: guarda a posição do mouse (-1 a 1) em variáveis CSS,
  // sem re-render do React
  const handleSectionMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const my = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    el.style.setProperty("--mx", mx.toFixed(3));
    el.style.setProperty("--my", my.toFixed(3));
  };

  const handleSectionLeave = () => {
    const el = sectionRef.current;
    if (!el) return;
    el.style.setProperty("--mx", "0");
    el.style.setProperty("--my", "0");
  };

  // Efeito 3D que segue o mouse na polaroid
  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 a 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${-y * 10}deg) rotateY(${
      x * 12
    }deg) rotate(0deg) translateY(-8px) scale(1.04)`;
  };

  const handleLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = `perspective(900px) rotateX(0deg) rotateY(0deg) rotate(${BASE_ROTATE}deg) translateY(0) scale(1)`;
  };

  const reveal = (delay: string) =>
    `transition-all duration-700 ease-out motion-reduce:transition-none ${delay} ${
      visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
    }`;

  return (
    <section
      id="nossa-causa"
      ref={sectionRef}
      onMouseMove={handleSectionMove}
      onMouseLeave={handleSectionLeave}
      className="relative overflow-hidden bg-gradient-to-br from-[#0050AD] to-[#002147] px-6 py-24 text-white lg:py-32"
    >
      {/* Keyframes da flutuação dos stickers (pode mover para o globals.css) */}
      <style>{`
        @keyframes sticker-float {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(var(--rot, 0deg)); }
          50% {
            transform: translate3d(0, calc(var(--amp, 8px) * -1), 0)
              rotate(calc(var(--rot, 0deg) + var(--tilt, 2deg)));
          }
        }
        .sticker-float { animation: sticker-float var(--dur, 7s) ease-in-out var(--delay, 0s) infinite; }
        @media (prefers-reduced-motion: reduce) {
          .sticker-float { animation: none; transform: rotate(var(--rot, 0deg)); }
          .sticker-parallax { transform: none !important; }
        }
      `}</style>

      {/* ============ BACKGROUND ============ */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 select-none"
      >
        {/* Trama de pontos: eco do halftone dos stickers */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.09)_1px,transparent_1.4px)] bg-[length:20px_20px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />

        {/* Luz âmbar atrás da polaroid */}
        <div className="absolute left-[8%] top-1/2 hidden h-[60%] w-[40%] -translate-y-1/2 bg-[radial-gradient(closest-side,rgba(215,133,33,0.22),transparent)] blur-2xl lg:block" />

        {/* Stickers: wrapper (posição + parallax) > reveal (pop-in) > img (flutuação) */}
        {STICKERS.map((s, i) => (
          <div
            key={s.src}
            className={`sticker-parallax absolute transition-transform duration-500 ease-out ${
              s.m
                ? "w-[var(--mw)] left-[var(--ml)] top-[var(--mt)] opacity-40 lg:w-[var(--w)] lg:left-[var(--l)] lg:top-[var(--t)] lg:opacity-100"
                : "hidden w-[var(--w)] left-[var(--l)] top-[var(--t)] lg:block"
            }`}
            style={
              {
                "--w": `${s.w}%`,
                "--l": `${s.left}%`,
                "--t": `${s.top}%`,
                ...(s.m && {
                  "--mw": `${s.m.w}%`,
                  "--ml": `${s.m.left}%`,
                  "--mt": `${s.m.top}%`,
                }),
                transform: `translate3d(calc(var(--mx, 0) * ${s.depth}px), calc(var(--my, 0) * ${s.depth}px), 0)`,
              } as React.CSSProperties
            }
          >
            <div
              className={`transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none ${
                visible ? "scale-100 opacity-100" : "scale-50 opacity-0"
              }`}
              style={{ transitionDelay: `${350 + i * 110}ms` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.src}
                alt=""
                draggable={false}
                className="sticker-float h-auto w-full max-w-none drop-shadow-[0_12px_20px_rgba(0,20,50,0.35)]"
                style={
                  {
                    "--rot": `${s.rotate ?? 0}deg`,
                    "--amp": `${s.amp}px`,
                    "--tilt": `${s.tilt}deg`,
                    "--dur": `${s.dur}s`,
                    "--delay": `${s.delay}s`,
                  } as React.CSSProperties
                }
              />
            </div>
          </div>
        ))}
      </div>

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2 lg:gap-20">
        {/* ============ POLAROID + VÍDEO ============ */}
        <div className={`flex flex-col items-center ${reveal("delay-0")}`}>
          <div
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            className="group relative"
          >
            {/* Sticker "tirando-foto": preso ao topo da polaroid, atrás dela */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/stickers/tirando-foto.png"
              alt=""
              aria-hidden
              draggable={false}
              className="pointer-events-none absolute bottom-[calc(100%-8px)] left-[10.5%] h-auto w-[28%] max-w-none select-none"
            />

            <div
              ref={cardRef}
              style={{
                transform: `perspective(900px) rotate(${BASE_ROTATE}deg)`,
              }}
              className="relative w-[300px] bg-white p-3 pb-20 shadow-[0_20px_50px_rgba(0,0,0,0.35)] transition-[transform,box-shadow] duration-300 ease-out will-change-transform hover:shadow-[0_35px_80px_rgba(0,0,0,0.5)] sm:w-[340px]"
            >
              {/* Alfinete */}
              <span
                aria-hidden
                className="absolute -top-3 left-1/2 z-10 h-5 w-5 -translate-x-1/2 rounded-full bg-red-500 shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.35),0_4px_6px_rgba(0,0,0,0.4)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-125"
              />

              {/* Vídeo em loop */}
              <div className="relative aspect-[2/3] w-full overflow-hidden bg-neutral-700">
                <video
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 motion-reduce:transition-none"
                  src="/videos/prota.mp4"
                  poster="/videos/poster.jpg"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                />
                {/* Brilho que atravessa o vídeo no hover */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full"
                />
              </div>
            </div>
          </div>

          {/* Legenda manuscrita com seta */}
          <div className="pl-20 group mt-6 flex cursor-default items-center gap-3 self-center">
            <svg
              aria-hidden
              viewBox="0 0 48 36"
              className="h-8 w-10 shrink-0 -rotate-6 text-[#D78521] transition-transform duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:-rotate-12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M44 30C30 32 14 26 6 8" />
              <path d="M5 18V6h12" />
            </svg>
            <span className="font-[family-name:var(--font-script,cursive)] text-xl italic text-white transition-colors duration-300 ">
              Onde a narrativa ganha forma
            </span>
          </div>
        </div>

        {/* ============ TEXTO ============ */}
        <div className="min-w-0 max-w-[810px] font-[family-name:var(--font-poppins,Poppins,sans-serif)]">
          {/*
            Título em 3 linhas fixas, em cascata:
            - whitespace-nowrap em TODOS os breakpoints impede a quebra de linha
            - cada linha é um <span className="block"> com tamanho próprio
            - clamp(mín, vw, máx) faz o tamanho escalar com a tela, assim a linha
              não estoura a coluna. Ajuste os 3 valores para aumentar/diminuir.
          */}
          <h2
            className={`font-[family-name:var(--font-nura,Nura,sans-serif)] font-black uppercase leading-[0.95] ${reveal(
              "delay-200",
            )}`}
          >
            <span className="block whitespace-nowrap text-[clamp(1.5rem,3vw,2.4rem)]">
              Você no centro
            </span>
            <span className="block whitespace-nowrap text-[clamp(1.8rem,3.6vw,2.9rem)]">
              da história como
            </span>
            <span className="group/prota mt-1 block cursor-default whitespace-nowrap text-[clamp(2.2rem,4.6vw,3.8rem)]">
              <span className="inline-block -ml-3 bg-white px-3 py-1 text-[#002147] transition-all duration-300 group-hover/prota:-rotate-2 group-hover/prota:bg-[#D78521] group-hover/prota:text-white">
                Prota
              </span>
              <span className="inline-block transition-colors duration-300 group-hover/prota:text-[#D78521]">
                gonista
              </span>
            </span>
          </h2>

          <p
            className={`mt-8 text-lg leading-relaxed text-white/95 ${reveal(
              "delay-300",
            )}`}
          >
            Nossa proposta é contar a sua história de forma criativa, cativante
            e estratégica. Afinal, Prota significa ser{" "}
            <strong className="relative font-bold text-white">
              <span className="bg-gradient-to-r from-[#D78521] to-[#D78521] bg-[length:100%_2px] bg-bottom bg-no-repeat transition-[background-size] duration-300">
                PROTAgonista
              </span>
            </strong>{" "}
            da sua própria narrativa.
          </p>

          <p
            className={`mt-5 text-lg leading-relaxed text-white/95 ${reveal(
              "delay-[400ms]",
            )}`}
          >
            Grandes marcas vendem mais do que produtos: vendem histórias e
            estilos de vida. Para se destacar, é preciso assumir o protagonismo
            e a Prota existe para transformar sua história em uma narrativa que
            conecta e deixa sua marca.
          </p>

          <div
            className={`mt-9 border-t border-white/15 pt-8 ${reveal(
              "delay-500",
            )}`}
          >
            <a
              href="#servicos"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-[#D78521] px-7 py-4 text-sm font-semibold text-[#002147] shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#D78521]/30 active:translate-y-0"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full"
              />
              <span className="relative">Conhecer nossas soluções</span>
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="relative -ml-2 h-4 w-0 opacity-0 transition-all duration-300 group-hover:ml-0 group-hover:w-4 group-hover:translate-x-1 group-hover:opacity-100"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}