import { InstagramIcon, MessageCircle, Send } from "lucide-react";
import Link from "next/link";

export default function Contacto() {

    return (
        <section id="contacto" className="w-full bg-gradient-to-br from-gray-900 to-black py-16 px-6 md:px-16 flex flex-col md:flex-row items-center justify-between gap-12">
        
        {/* Columna izquierda - Redes */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start gap-6">
            
            <h2 className="text-3xl font-bold text-white">Contactemos!</h2>
            
            <p className="text-gray-300">
                Podés hablarme directamente por mis redes o apps de mensajería.
            </p>

            <div className="flex flex-col gap-4 mt-4">
                
                {/* Instagram */}
                <a
                    href="https://instagram.com/instaguera"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-200 hover:text-pink-500 transition"
                >
                    <InstagramIcon size={24} />
                    <span>@instaguera</span>
                </a>

                {/* Whatapp */}
                <a
                    href="https://wa.me/5493416671140"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-200 hover:text-green-500 transition"
                >
                    <MessageCircle size={24} />
                    <span>+54 9 341 667-1140</span>
                </a>

                {/* Telegram */}
                <a
                    href="https://t.me/instaguera"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-200 hover:text-sky-500 transition"
                >
                    <Send size={24} />
                    <span>@instaguera</span>
                </a>
            </div>
        </div>

        {/* Columna derecha - CTA */}
        <div className="w-full md:w-1/2 text-center md:text-right space-y-6">
            <h3 className="text-2xl font-semibold text-white">
                ¿Listo para tu próximo tatuaje?
            </h3>
            <p className="text-gray-300 max-w-md md:ml-auto">
                Creá tu cuenta y reservá un turno online. Es rápido y fácil para que no tengas que esperar.
            </p>
            <Link href="/register" className="bg-indigo-600 hover:bg-gray-200 text-black font-semibold px-8 py-3 rounded-2xl shadow-md hover:scale-105 transition cursor-pointer">
                Crear cuenta y sacar turno
            </Link>
        </div>
    </section>
    );
}
