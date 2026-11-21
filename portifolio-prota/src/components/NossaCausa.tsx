"use client";

import { useEffect, useRef, useState } from "react";

const BASE_ROTATE = -3; // inclinação padrão da polaroid (graus)

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
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

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
      className="relative overflow-hidden bg-gradient-to-br from-[#0050AD] to-[#002147] px-6 py-24 text-white lg:py-32"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2 lg:gap-20">
        {/* ============ POLAROID + VÍDEO ============ */}
        <div
          className={`flex flex-col items-center ${reveal("delay-0")}`}
        >
          <div
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            className="group relative"
          >
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
          <div className="group mt-6 flex cursor-default items-center gap-3 self-center">
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
            <span className="font-[family-name:var(--font-script,cursive)] text-xl italic text-white transition-colors duration-300 group-hover:text-[#D78521]">
              Onde a narrativa ganha forma
            </span>
          </div>
        </div>

        {/* ============ TEXTO ============ */}
        <div className="max-w-[610px] font-[family-name:var(--font-poppins,Poppins,sans-serif)]">
          <p
            className={`mb-3 text-lg text-[#D78521] ${reveal("delay-100")}`}
          >
            Nossa causa · Quem somos?
          </p>

          <h2
            className={`font-[family-name:var(--font-nura,Nura,sans-serif)] text-4xl font-black uppercase leading-[0.95] sm:text-5xl lg:text-[3.4rem] ${reveal(
              "delay-200"
            )}`}
          >
            Você no centro da história como{" "}
            <span className="group/prota mt-1 inline-block cursor-default">
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
              "delay-300"
            )}`}
          >
            Nossa proposta é contar a sua história de forma criativa,
            cativante e estratégica. Afinal, Prota significa ser{" "}
            <strong className="relative font-bold text-white">
              <span className="bg-gradient-to-r from-[#D78521] to-[#D78521] bg-[length:100%_2px] bg-bottom bg-no-repeat transition-[background-size] duration-300 hover:bg-[length:100%_100%] hover:text-[#002147]">
                PROTAgonista
              </span>
            </strong>{" "}
            da sua própria narrativa.
          </p>

          <p
            className={`mt-5 text-lg leading-relaxed text-white/95 ${reveal(
              "delay-[400ms]"
            )}`}
          >
            Grandes marcas vendem mais do que produtos: vendem histórias e
            estilos de vida. Para se destacar, é preciso assumir o
            protagonismo e a Prota existe para transformar sua história em uma
            narrativa que conecta e deixa sua marca.
          </p>

          <div
            className={`mt-9 border-t border-white/15 pt-8 ${reveal(
              "delay-500"
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