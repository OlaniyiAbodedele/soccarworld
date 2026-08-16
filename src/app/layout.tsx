import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://soccarworld.com"),

  title: {
    default: "SoccaR | The Global Football Ecosystem",
    template: "%s | SoccaR",
  },

  description:
    "SoccaR is building the world's connected football ecosystem for fans, players, clubs, coaches, scouts, media, businesses and football institutions.",

  applicationName: "SoccaR",

  keywords: [
    "SoccaR",
    "football technology",
    "football community",
    "global football platform",
    "football ecosystem",
    "football fans",
    "football clubs",
    "football players",
    "football scouts",
  ],

  authors: [
    {
      name: "SoccaR",
      url: "https://soccarworld.com",
    },
  ],

  creator: "SoccaR",
  publisher: "SoccaR",

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://soccarworld.com",
    siteName: "SoccaR",
    title: "SoccaR | The Global Football Ecosystem",
    description:
      "One global home connecting football's people, communities and opportunities.",
  },

  twitter: {
    card: "summary_large_image",
    title: "SoccaR | The Global Football Ecosystem",
    description:
      "One global home connecting football's people, communities and opportunities.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}