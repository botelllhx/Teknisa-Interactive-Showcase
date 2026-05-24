import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// v13 swap: Plus Jakarta Sans is the closest open-source font to Google Sans
// (Product Sans), the family the client referenced. We use it for BOTH display
// and ui — it has enough weight range (400-800) to cover headings and body,
// and gives the Linear/Notion/Noteflow-style geometric clarity the project
// kept missing under Roboto. Variable preserves backward CSS-var compat:
// --font-display and --font-ui both point to Plus Jakarta Sans now.
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-ui",
  display: "swap",
});

const jakartaDisplay = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
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
    <html lang="pt-BR" className={`${jakarta.variable} ${jakartaDisplay.variable}`}>
      <body className="font-ui antialiased">{children}</body>
    </html>
  );
}
