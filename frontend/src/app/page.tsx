import GridTatuajes from "@/components/GridTatuajes";
import Hero from "@/components/Hero";
import NavBar from "@/components/NavBar";
import Contacto from "@/components/Contacto";
/* import Footer from "@/components/Footer"; */

export default function Home() {

  return (

    <div className="min-h-screen font-montserrat">
      <div id="inicio"></div>

      <NavBar />

      <Hero />

      <GridTatuajes />

      <Contacto />

      {/* <Footer /> */}

    </div>
  );
}