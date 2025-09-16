import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "600", "700"], // pesos que necesites
  variable: "--font-roboto", 
});

export const metadata: Metadata = {
  title: "Instaguera - Rosario",
  description: "Tatuajes de calidad en Rosario.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${roboto.variable} antialiased`}
      >
        <NavBar />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
