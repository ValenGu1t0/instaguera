import Hero from "@/components/Hero";

export default function Home() {


  return (

    <div className="min-h-screen mt-32">

      <Hero />

      <div className="p-20 my-12 sm:my-20 flex flex-row items-center justify-center bg-indigo-950 font-semibold text-4xl">
        <h2 className="text-center text-white">ÚLTIMOS TATUAJES</h2>
      </div>

    </div>
  );
}
