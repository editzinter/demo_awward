import type { Metadata } from "next";
import { Oswald, Roboto_Mono } from "next/font/google";
import "./globals.css";
import NoiseOverlay from "../components/NoiseOverlay";
import CustomCursor from "../components/CustomCursor";
import SmoothScroller from "../components/SmoothScroller";

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
  weight: ["400", "500", "700"]
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "METALLICA | Official",
  description: "The official landing page of Metallica. Tour dates, music, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${oswald.variable} ${robotoMono.variable} cursor-none`}>
      <body className="bg-black text-zinc-100 font-mono antialiased selection:bg-red-700 selection:text-white overflow-x-hidden min-h-screen">
        <SmoothScroller />
        <CustomCursor />
        <NoiseOverlay />
        {children}
      </body>
    </html>
  );
}
