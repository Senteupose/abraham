import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://abrahamposesenteu.ke"),
  title: {
    default: "Abraham Pose Senteu — FinTech Engineer & MCA Aspirant, Magadi Ward",
    template: "%s · Abraham Pose Senteu",
  },
  description:
    "Abraham Pose Senteu — FinTech Engineer, AI Developer, and MCA Aspirant for Magadi Ward, Kajiado County. Linda Mwananchi grassroots platform.",
  applicationName: "Abraham Pose Senteu — Magadi Ward",
  authors: [{ name: "Abraham Pose Senteu" }],
  keywords: [
    "Abraham Pose Senteu",
    "Magadi Ward",
    "Kajiado County",
    "MCA 2027",
    "FinTech Kenya",
    "Linda Mwananchi",
    "Equity Bank",
    "Pwani University",
  ],
  openGraph: {
    title: "Abraham Pose Senteu — Magadi Ward MCA Aspirant",
    description: "FinTech, AI and digital accountability for Magadi Ward.",
    type: "website",
    locale: "en_KE",
  },
  twitter: {
    card: "summary_large_image",
    title: "Abraham Pose Senteu — Magadi Ward MCA Aspirant",
    description: "FinTech, AI and digital accountability for Magadi Ward.",
  },
  icons: {
    icon: "/favicon.svg",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0F172A",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-canvas text-ink antialiased font-body">{children}</body>
    </html>
  );
}
