import Image from "next/image";

export default function Hero() {

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-6 sm:p-8">

        {/* Parrafo de Introducción */}
        <div className="w-full sm:w-1/2 gap-2 flex flex-col text-justify rounded-xl p-8 bg-gradient-to-tr bg-indigo-950">
            <h1 className="text-2xl font-bold italic text-white">Soy Thiago!</h1>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem nostrum quae accusantium tenetur facilis nulla quibusdam animi tempora repudiandae, similique blanditiis sed natus iste! Aliquam accusamus pariatur eos obcaecati illo!</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus, eius quibusdam. Velit inventore iste sequi rerum hic deleniti ratione, deserunt laborum in. Dolorem maiores pariatur eveniet cumque iusto voluptate nemo.</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus, eius quibusdam. Velit inventore iste sequi rerum hic deleniti ratione, deserunt laborum in. Dolorem maiores pariatur eveniet cumque iusto voluptate nemo.</p>
        </div>
        
       {/* Columna imagen */}
        <div className="relative w-full md:w-1/2 rounded-xl overflow-hidden">
            <Image
                src="/perfil.jpg"
                alt="Foto de perfil"
                fill
                className="object-cover"
                priority
            />
        </div>
    </div>
  )
}