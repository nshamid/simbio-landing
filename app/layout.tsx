import type { Metadata } from "next";
import { Baloo_2, Inter } from "next/font/google";
import "./globals.css";

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-baloo",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Simbio — Tempat Ilmu dan Kesempatan Saling Bertemu",
  description:
    "Simbio menghubungkan orang yang ingin berbagi ilmu dengan orang yang ingin belajar secara personal dan terjangkau, dengan kurasi kualitas dan pembayaran yang aman di setiap kelas.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${baloo.variable} ${inter.variable}`}>
      <body className="bg-canvas font-body text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
