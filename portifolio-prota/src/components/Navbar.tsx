"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const links = [
  { label: "Quem somos?", href: "#quem-somos" },
  { label: "Soluções", href: "#solucoes" },
  { label: "Cases", href: "#cases" },
  { label: "Parcerias", href: "#parcerias" },
  { label: "Contato", href: "#contato" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#quem-somos");

  // Compacta a barra ao rolar a página
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Destaca o link da seção que está no centro da tela
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        }),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    links.forEach(({ href }) => {
      const el = document.querySelector(href);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <nav
        aria-label="Navegação principal"
        className={`mx-auto flex w-full items-center gap-3 rounded-full bg-white/85 px-3 shadow-lg ring-1 ring-black/5 backdrop-blur-xl transition-all duration-500 md:w-fit md:gap-2 md:pr-5 ${
          scrolled ? "py-1.5 shadow-xl" : "py-2.5"
        }`}
      >
        {/* Logo dentro de círculo com gradiente */}
        <a href="#" aria-label="Prota — início" className="group shrink-0">
          <span
            className={`relative grid place-items-center overflow-hidden rounded-full bg-linear-to-br from-[#0050AD] to-[#002147] shadow-md transition-all duration-500 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-[#0050AD]/50 ${
              scrolled ? "size-9" : "size-11"
            }`}
          >
            {/* gradiente mais claro que aparece no hover */}
            <span className="absolute inset-0 bg-linear-to-br from-[#3C8CF0] to-[#0A5BC4] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <Image
              src="/simbolo-prota.svg"
              alt="Símbolo da Prota"
              width={44}
              height={44}
              priority
              className="relative size-full object-contain p-2 transition-transform duration-700 ease-out group-hover:rotate-180"
            />
          </span>
        </a>

        {/* Links desktop */}
        <ul className="hidden items-center gap-1 md:flex">
          {links.map(({ label, href }) => {
            const isActive = active === href;
            return (
              <li key={href}>
                <a
                  href={href}
                  className={`group relative isolate block rounded-full px-4 py-2 font-nura text-[15px] uppercase tracking-wide transition-colors duration-300 ${
                    isActive
                      ? "text-[#002147]"
                      : "text-neutral-500 hover:text-[#002147]"
                  }`}
                >
                  {/* fundo que cresce no hover */}
                  <span className="absolute inset-0 -z-10 scale-75 rounded-full bg-[#0050AD]/10 opacity-0 transition duration-300 group-hover:scale-100 group-hover:opacity-100" />
                  {label}
                  {/* traço laranja (cor de destaque da marca) */}
                  <span
                    className={`absolute -bottom-0.5 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-[#D78521] transition-all duration-300 group-hover:w-5 ${
                      isActive ? "w-5" : "w-0"
                    }`}
                  />
                </a>
              </li>
            );
          })}
        </ul>

        {/* Botão hambúrguer mobile */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          className="relative ml-auto mr-2 flex size-10 flex-col items-center justify-center gap-1.5 rounded-full transition hover:bg-[#0050AD]/10 md:hidden"
        >
          <span
            className={`h-0.5 w-5 rounded bg-[#002147] transition-all duration-300 ${
              open ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`h-0.5 w-5 rounded bg-[#002147] transition-all duration-300 ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-0.5 w-5 rounded bg-[#002147] transition-all duration-300 ${
              open ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      {/* Menu mobile */}
      <div
        className={`mx-auto mt-2 max-w-5xl origin-top overflow-hidden rounded-3xl bg-white/95 shadow-xl ring-1 ring-black/5 backdrop-blur-xl transition-all duration-300 md:hidden ${
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-2 scale-95 opacity-0"
        }`}
      >
        <ul className="flex flex-col p-3">
          {links.map(({ label, href }) => (
            <li key={href}>
              <a
                href={href}
                onClick={() => setOpen(false)}
                className={`block rounded-2xl px-4 py-3 font-nura uppercase tracking-wide transition hover:bg-[#0050AD]/10 hover:text-[#002147] ${
                  active === href ? "text-[#002147]" : "text-neutral-500"
                }`}
              >
                {label}
              </a>
            </li>
          ))}

        </ul>
      </div>
    </header>
  );
}