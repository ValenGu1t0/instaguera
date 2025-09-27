import Image from "next/image";

export default function Hero() {

  return (
    
    <section className="flex flex-col md:flex-row items-center justify-between min-h-screen px-12 md:px-16 bg-gradient-to-br from-gray-800 to-black">
      
      {/* Columna izquierda: Texto */}
      <div className="w-full md:w-1/2 text-center md:text-left space-y-6 mt-36">
        
        <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight">
          Thiago <span className="text-indigo-700">Reis</span>
        </h1>

        <p className="text-lg text-gray-300 max-w-md mx-auto md:mx-0">
          Arte único, detalles que cuentan historias y diseños que marcan tu piel para siempre. Descubrí mi trabajo y llevá tu idea a la realidad.
        </p>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
          <a href="#tattoos" className="bg-white text-black font-semibold px-6 py-3 rounded-2xl shadow-md hover:scale-105 transition">
            Ver trabajos
          </a>
          <a href="#contacto" className="border border-white text-white px-6 py-3 rounded-2xl hover:bg-white/10 transition">
            Contacto
          </a>
        </div>

      </div>

      {/* Columna derecha: Foto con efecto ink splash */}
      <div className="relative w-64 h-64 md:w-80 md:h-80 my-10 md:mt-32">

        {/* Contenedor con máscara SVG */}
        <div className="absolute inset-0 mask-ink-splash overflow-hidden">
          <Image
            src="/perfil.jpg"
            alt="Thiago"
            fill
            className="object-cover grayscale"
            priority
          />
        </div>

      </div>

    </section>
  );
}