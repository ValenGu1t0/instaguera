import GridTatuajes from "@/components/GridTatuajes";
import Hero from "@/components/Hero";
import NavBar from "@/components/NavBar";

export default function Home() {

  return (

    <div className="min-h-screen mt-32 ">

      <NavBar />
      
      <Hero />

      <div className="p-20 my-12 sm:my-20 flex flex-row items-center justify-center bg-gradient-to-br from-gray-900 to-black font-semibold text-4xl">
        <h2 className="text-center text-white">ÚLTIMOS TATUAJES</h2>
      </div>

      <GridTatuajes />

    </div>

  );
}