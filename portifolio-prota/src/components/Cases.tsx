"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";

/* ================================================================== */
/*  ÁREA DE EDIÇÃO — troque textos, mídias e links só aqui em cima     */
/* ================================================================== */

const TITLE_SMALL = "Alguns dos"; // linha pequena, acima do título
const TITLE_MAIN = "Nossos "; // título principal, em negrito
const TITLE_HIGHLIGHT = "Cases"; // palavra em itálico com sublinhado âmbar
const BUTTON_LABEL = "Ver mais";

// Padrões usados quando o case não define o próprio valor
const DEFAULT_LINK = "https://www.instagram.com/p/DVeTXYjlG-s/";
const DEFAULT_PHOTO = "/foto2.png";
const DEFAULT_VIDEO = "/videos/prota.mp4";
const DEFAULT_POSTER = "/videos/poster.jpg";

type CaseItem = {
  type: "video" | "foto";
  category: string; // linha pequena em azul
  title: string; // título do case
  wide?: boolean; // true = ocupa 2 colunas (card largo)
  href?: string; // link do post (opcional, senão usa DEFAULT_LINK)
  src?: string; // foto ou vídeo próprio (opcional)
  poster?: string; // capa do vídeo (opcional)
};

/*
  Para ADICIONAR um case: copie um bloco { ... } e cole na lista.
  Para REMOVER: apague o bloco. Os contadores dos filtros se ajustam sozinhos.
  Exemplo com mídia e link próprios:
  { type: "video", category: "Fotografia", title: "Meu case",
    src: "/videos/meu-video.mp4", href: "https://www.instagram.com/p/XXXX/" },
*/
const CASES: CaseItem[] = [
  {
    type: "video",
    wide: true,
    category: "Edição de vídeos",
    title: "Edição & Pós-Produção — Sound Design",
  },
  {
    type: "foto",
    category: "Produção audiovisual",
    title: "Captação Cinematográfica — Set Comercial",
  },
  {
    type: "video",
    category: "Cobertura de evento",
    title: "Estúdio Multi-Câmera & Podcast Ao Vivo",
  },
  {
    type: "foto",
    category: "Identidade visual",
    title: "Identidade Visual — Bico Doce",
  },
  {
    type: "video",
    category: "Produção audiovisual",
    title: "Color Grading & Ritmo de Corte",
  },
  {
    type: "foto",
    wide: true,
    category: "Cobertura de evento",
    title: "Direção de Palco & Mesa de Corte",
  },
  {
    type: "foto",
    category: "Design gráfico",
    title: "Branding & Rebranding — Academia FBW",
  },
  {
    type: "video",
    category: "Gestão de rede social",
    title: "Produção Audiovisual para Conteúdo",
  },
  {
    type: "foto",
    category: "Fotografia",
    title: "Bastidores & Fotografia Documental",
  },
  {
    type: "video",
    category: "Edição de vídeos",
    title: "Narrativa Dinâmica para Reels & Ads",
  },
];

/* ================================================================== */
/*  Detalhes visuais (inclinação e posição do alfinete de cada card)   */
/* ================================================================== */

const TILTS = [-1, 1.2, -0.8, 1, -1.2, 0.8, -1, 1.4, -0.6, 1];
const PINS = ["50%", "46%", "54%", "49%", "52%", "50%", "47%", "53%", "50%", "48%"];

// Borda rasgada do papel do título
const TORN_PAPER =
  "polygon(0 8%,3% 0,9% 6%,16% 0,25% 5%,34% 0,45% 6%,56% 1%,68% 6%,80% 0,90% 5%,100% 1%,99% 40%,100% 70%,99% 100%,90% 94%,78% 100%,66% 95%,52% 100%,40% 94%,28% 100%,16% 95%,6% 100%,0 94%,1% 65%,0 35%)";

// Pontas rasgadas da fita adesiva
const TAPE_CLIP =
  "polygon(0 0,100% 0,97% 20%,100% 40%,96% 60%,100% 80%,98% 100%,0 100%,3% 80%,0 60%,4% 40%,0 20%)";

// Linhas de caderno (azul bem claro)
const NOTEBOOK_LINES: CSSProperties = {
  backgroundColor: "#fff",
  backgroundImage:
    "linear-gradient(to bottom, transparent 0, transparent 27px, rgba(70,130,210,.22) 27px, rgba(70,130,210,.22) 28px)",
  backgroundSize: "100% 28px",
};

type Filter = "todos" | "video" | "foto";

const css = `
.case-wrap{position:relative}
.case-wrap:hover,.case-wrap:focus-within{z-index:30}
.case-card{
  transform:rotate(var(--tilt));
  transition:transform .55s cubic-bezier(.2,.8,.2,1), box-shadow .55s ease;
  box-shadow:0 14px 30px rgba(0,10,40,.35);
}
.case-wrap:hover .case-card,.case-wrap:focus-within .case-card{
  transform:rotate(0deg) translateY(-10px) scale(1.03);
  box-shadow:0 34px 60px rgba(0,10,40,.55);
}
@keyframes case-in{
  from{opacity:0;transform:translateY(34px) scale(.95)}
  to{opacity:1;transform:none}
}
@media (prefers-reduced-motion: reduce){
  .case-wrap{animation:none !important;opacity:1 !important}
  .case-card{transition:none !important}
}
`;

/* Vídeo em loop que só toca quando está visível na tela (economiza processamento) */
function CaseVideo({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-focus-within:scale-110"
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
    />
  );
}

export default function Cases() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [filter, setFilter] = useState<Filter>("todos");

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
      { threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const counts = {
    todos: CASES.length,
    video: CASES.filter((c) => c.type === "video").length,
    foto: CASES.filter((c) => c.type === "foto").length,
  };

  const FILTERS: { id: Filter; label: string }[] = [
    { id: "todos", label: `Todos (${counts.todos})` },
    { id: "video", label: `Vídeos (${counts.video})` },
    { id: "foto", label: `Fotos (${counts.foto})` },
  ];

  // guarda o índice original para manter inclinação/alfinete de cada card
  const items = CASES.map((c, i) => ({ ...c, i })).filter(
    (c) => filter === "todos" || c.type === filter,
  );

  const fade = `transition-all duration-700 ease-out motion-reduce:transition-none ${
    visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
  }`;

  return (
    <section
      id="cases"
      ref={sectionRef}
      aria-labelledby="cases-titulo"
      className="relative overflow-hidden bg-gradient-to-b from-[#0050AD] via-[#003C8C] to-[#002147] px-6 py-24 text-white lg:py-32"
    >
      <style>{css}</style>

      {/* fundo: pontilhado sutil + brilhos */}
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
        className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full bg-[#D78521]/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 bottom-20 h-96 w-96 rounded-full bg-[#0050AD]/40 blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* ============ CABEÇALHO ============ */}
        <div
          className={`flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between ${fade}`}
        >
          {/* título: folha de caderno rasgada + fita adesiva */}
          <div
            className="relative mt-3 w-fit max-w-full"
            style={{ filter: "drop-shadow(0 14px 20px rgba(0,10,40,.45))" }}
          >
            {/* fita adesiva (fora do clip-path para não ser cortada) */}
            <span
              aria-hidden
              className="absolute -top-3 left-1/2 z-10 h-7 w-24 -translate-x-1/2 rotate-1 bg-[#D78521]/90"
              style={{ clipPath: TAPE_CLIP }}
            />

            <div
              className="-rotate-1 py-7 pl-14 pr-8 sm:py-9 sm:pl-[4.5rem] sm:pr-12"
              style={{ ...NOTEBOOK_LINES, clipPath: TORN_PAPER }}
            >
              {/* margem vermelha do caderno */}
              <span
                aria-hidden
                className="absolute bottom-0 left-8 top-0 w-px bg-red-400/60 sm:left-10"
              />

              <h2
                id="cases-titulo"
                className="text-left leading-none text-[#001B44]"
              >
                {/* linha pequena */}
                <span className="block font-serif text-sm italic font-medium text-[#0050AD] sm:text-base">
                  {TITLE_SMALL}
                </span>

                {/* título em destaque */}
                <span className="mt-2 block font-nura text-4xl font-black sm:mt-3 sm:text-6xl">
                  {TITLE_MAIN}
                  <span className="relative inline-block px-1 font-serif italic font-medium">
                    {TITLE_HIGHLIGHT}
                    {/* sublinhado âmbar à mão */}
                    <span
                      aria-hidden
                      className="absolute -bottom-1.5 left-0 h-[3px] w-full -rotate-1 rounded-full bg-[#D78521]"
                    />
                  </span>
                </span>
              </h2>
            </div>
          </div>

          {/* filtros (sem quebra de linha) */}
          <div
            role="group"
            aria-label="Filtrar cases"
            className="flex w-fit max-w-full flex-nowrap gap-1 self-start overflow-x-auto rounded-full border border-white/20 bg-white/5 p-1 backdrop-blur-sm lg:self-auto"
          >
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={filter === f.id}
                onClick={() => setFilter(f.id)}
                className={`shrink-0 whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-semibold transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D78521] sm:px-5 sm:text-sm ${
                  filter === f.id
                    ? "bg-[#D78521] text-[#001B44] shadow-lg shadow-black/20"
                    : "text-white/85 hover:bg-white/10 hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* ============ GRID DE CASES ============ */}
        <div className="mt-14 grid grid-flow-dense grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((c, n) => {
            const href = c.href ?? DEFAULT_LINK;
            return (
              <div
                key={`${filter}-${c.i}`}
                className={`case-wrap ${c.wide ? "sm:col-span-2" : ""}`}
                style={{
                  opacity: visible ? undefined : 0,
                  animation: visible
                    ? `case-in .7s cubic-bezier(.2,.8,.2,1) ${n * 70}ms both`
                    : undefined,
                }}
              >
                <article
                  className="case-card group relative flex h-full flex-col bg-white p-3"
                  style={
                    {
                      "--tilt": `${TILTS[c.i % TILTS.length]}deg`,
                    } as CSSProperties
                  }
                >
                  {/* alfinete */}
                  <span
                    aria-hidden
                    className="absolute -top-2.5 z-20 h-4 w-4 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_30%_30%,#F6B45A,#D78521_55%,#9A5A0E)] shadow-[0_3px_5px_rgba(0,0,0,0.4)] transition-transform duration-300 group-hover:-translate-y-1.5 group-hover:scale-125"
                    style={{ left: PINS[c.i % PINS.length] }}
                  />

                  {/* mídia */}
                  <div
                    className={`relative w-full overflow-hidden bg-[#001634] ${
                      c.wide ? "aspect-[16/10] sm:aspect-[16/9]" : "aspect-[4/5]"
                    }`}
                  >
                    {c.type === "video" ? (
                      <CaseVideo
                        src={c.src ?? DEFAULT_VIDEO}
                        poster={c.poster ?? DEFAULT_POSTER}
                      />
                    ) : (
                      <Image
                        src={c.src ?? DEFAULT_PHOTO}
                        alt={c.title}
                        fill
                        sizes={
                          c.wide
                            ? "(min-width: 1024px) 50vw, 100vw"
                            : "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                        }
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-focus-within:scale-110"
                      />
                    )}

                    {/* brilho que atravessa a mídia no hover */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full"
                    />

                    {/* véu + botão "Ver mais" (link do post) */}
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${BUTTON_LABEL}: ${c.title}`}
                      className="absolute inset-0 z-10 flex items-center justify-center bg-gradient-to-t from-[#001634]/85 via-[#001634]/35 to-transparent opacity-0 outline-none transition-opacity duration-500 group-hover:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:items-end [@media(hover:none)]:justify-end [@media(hover:none)]:bg-none [@media(hover:none)]:p-3 [@media(hover:none)]:opacity-100"
                    >
                      <span className="inline-flex translate-y-4 items-center gap-2 rounded-full bg-[#D78521] px-5 py-2.5 text-sm font-semibold text-[#001B44] shadow-lg shadow-black/30 transition-all duration-500 hover:scale-105 group-hover:translate-y-0 group-focus-within:translate-y-0 [@media(hover:none)]:translate-y-0">
                        {BUTTON_LABEL}
                        <svg
                          aria-hidden
                          viewBox="0 0 24 24"
                          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M7 17L17 7M8 7h9v9" />
                        </svg>
                      </span>
                    </a>
                  </div>

                  {/* legenda */}
                  <div className="min-h-[88px] px-1 pb-4 pt-3">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#0050AD] transition-colors duration-300 group-hover:text-[#D78521]">
                      {c.category}
                    </p>
                    <h3 className="mt-1 text-[15px] font-semibold leading-snug text-[#001B44]">
                      {c.title}
                    </h3>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}