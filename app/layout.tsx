import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Biwak - KG Knallköpp Golkrath",
  description: "Live-Programmanzeige für den Biwak der KG Knallköpp Golkrath",
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    type: "website",
    title: "Biwak - KG Knallköpp Golkrath",
    description: "Live-Programmanzeige für den Biwak der KG Knallköpp Golkrath",
    siteName: "Biwak - KG Knallköpp Golkrath",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "KG Knallköpp Golkrath",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Biwak - KG Knallköpp Golkrath",
    description: "Live-Programmanzeige für den Biwak der KG Knallköpp Golkrath",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
