import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// 1. Poppins via Google Fonts
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

// 2. Nura local (todos os 9 pesos da pasta src/fonts)
const nura = localFont({
  src: [
    { path: "../fonts/Nura-Thin.ttf", weight: "100", style: "normal" },
    { path: "../fonts/Nura-ExtraLight.ttf", weight: "200", style: "normal" },
    { path: "../fonts/Nura-Light.ttf", weight: "300", style: "normal" },
    { path: "../fonts/Nura-Normal.ttf", weight: "400", style: "normal" },
    { path: "../fonts/Nura-Medium.ttf", weight: "500", style: "normal" },
    { path: "../fonts/Nura-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../fonts/Nura-Bold.ttf", weight: "700", style: "normal" },
    { path: "../fonts/Nura-ExtraBold.ttf", weight: "800", style: "normal" },
    { path: "../fonts/Nura-Black.ttf", weight: "900", style: "normal" },
  ],
  variable: "--font-nura",
});

export const metadata: Metadata = {
  title: "Portfolio Prota",
  description: "Descrição do projeto",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${poppins.variable} ${nura.variable}`}>
      <body className={`${poppins.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}