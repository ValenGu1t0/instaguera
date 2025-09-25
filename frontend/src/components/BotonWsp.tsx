import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {

    return (
        <a
            href="https://wa.me/5493416671140/?text=Hola%20Thiago!%20Quisiera%20cotizar%20mi%20tatuaje!"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 hover:scale-110 transition-transform"
        >
        <MessageCircle size={28} />
        </a>
    );
}
