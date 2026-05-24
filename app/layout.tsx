import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

// v13.3: Product Sans self-hosted. User dropped the official zip in /public,
// extracted to /public/fonts. Próxima a Google Sans visualmente (Google usa
// como font institucional). 4 weights/styles: 400 regular, 400 italic, 700
// bold, 700 bold italic. Variable CSS custom property --font-product fica
// disponível globalmente; globals.css aponta --font-ui / --font-display.
const productSans = localFont({
  src: [
    {
      path: "../public/fonts/ProductSans-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/ProductSans-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/ProductSans-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/ProductSans-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-product",
  display: "swap",
  fallback: ["Plus Jakarta Sans", "DM Sans", "system-ui", "sans-serif"],
});

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
    <html lang="pt-BR" className={productSans.variable}>
      <body className="font-ui antialiased">{children}</body>
    </html>
  );
}
