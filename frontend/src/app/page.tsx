import GridTatuajes from "@/components/GridTatuajes";
import Hero from "@/components/Hero";
import NavBar from "@/components/NavBar";

export default function Home() {

  return (

    <div className="min-h-screen mt-24 sm:mt-28 font-montserrat">

      <div id="inicio"></div>

      <NavBar />

      <Hero />

      <GridTatuajes />

    </div>

  );
}