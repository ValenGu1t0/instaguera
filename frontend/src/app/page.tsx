'use client'

import GridTatuajes from "@/components/GridTatuajes";
import Hero from "@/components/Hero";
import NavBar from "@/components/NavBar";
import Contacto from "@/components/Contacto";
import PageTransition from "@/components/PageTransition";

export default function Home() {

  return (
    <PageTransition>
      <div id="inicio"></div>
      <NavBar />
      <Hero />
      <GridTatuajes />
      <Contacto />
    </PageTransition>
  );
}