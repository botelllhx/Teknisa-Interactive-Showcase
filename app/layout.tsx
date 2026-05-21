import type { Metadata, Viewport } from "next";
import { Sora, Rubik } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ui",
  display: "swap",
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
    <html lang="pt-BR" className={`${sora.variable} ${rubik.variable}`}>
      <body className="font-ui antialiased">{children}</body>
    </html>
  );
}
