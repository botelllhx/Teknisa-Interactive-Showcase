import type { Metadata, Viewport } from "next";
import "./globals.css";

// v13.2: Google Sans real, carregada direto do Google CDN.
// Não está no catálogo público de Google Fonts (não dá pra usar next/font/google),
// mas o CSS está servido publicamente. O <link> no <head> baixa as 3 weights
// (400/500/700) e o globals.css aponta --font-ui / --font-display para
// 'Google Sans'. Fallback Plus Jakarta Sans → DM Sans → system.

export const metadata: Metadata = {
  title: "Teknisa Interactive Showcase",
  description:
    "Vitrine interativa de soluções Teknisa para food service, varejo, refeições coletivas, ERP e RH.",
};

export const viewport: Viewport = {
  width: 1920,
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        {/* Google Sans não está no catálogo público de Google Fonts, então
           next/font/google não consegue carregar. O link manual no App Router
           layout é equivalente — Next.js injeta no <head> de todas as páginas. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&display=swap"
        />
      </head>
      <body className="font-ui antialiased">{children}</body>
    </html>
  );
}
