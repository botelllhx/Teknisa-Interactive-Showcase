import type { Metadata, Viewport } from "next";
import { Sora, Roboto } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
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
    <html lang="pt-BR" className={`${sora.variable} ${roboto.variable}`}>
      <body className="font-ui antialiased">{children}</body>
    </html>
  );
}
