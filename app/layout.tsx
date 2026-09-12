import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Krivya | Personalized Gifts Across Miles",
  description:
    "A concept redesign for Krivya, a personalized gifting experience for thoughtful hampers, flowers, chocolates, baby gifts, and keepsakes.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Krivya | Personalized Gifts Across Miles",
    description:
      "Create a personal gift with Krivya using flowers, chocolates, keepsakes, photos, and custom details.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable}`}>{children}</body>
    </html>
  );
}
