import type { Metadata } from "next";
import { Roboto, Montserrat, Great_Vibes } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import WhatsAppButton from "@/components/BotonWsp";

// Aplicar cada variable css -- al globals
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-roboto", 
}); 

const montserrat = Montserrat({ 
  subsets: ["latin"], 
  variable: "--font-montserrat" 
});

const greatVibes = Great_Vibes({ 
  subsets: ["latin"], 
  weight: "400", 
  variable: "--font-great-vibes" 
});

export const metadata: Metadata = {
  title: "Instaguera",
  description: "Tatuajes de calidad en Rosario.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" data-scroll-behavior="smooth">
      <body className={`${montserrat.variable} ${roboto.variable} ${greatVibes.variable} antialiased`}>
        <main className="font-montserrat ">
          {children}
          <Toaster richColors position="bottom-right" />
        </main>
        <WhatsAppButton />
      </body>
    </html>
  );
}