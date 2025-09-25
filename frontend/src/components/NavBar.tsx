"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation"; 
import { useAuthStore } from "@/store/auth";
import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

export default function NavBar() {
  
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const router = useRouter();
  const { token, user, logout } = useAuthStore();

  let turnosHref = "/login";
  let turnosLabel = "Turnos";

  if (token) {
    if (user?.role === "ADMIN") {
      turnosHref = "/admin";
      turnosLabel = "Gestión";

    } else if (user?.role === "DUENO") {
      turnosHref = "/dueno";
      turnosLabel = "Gestión";

    } else if (user?.role === "CLIENTE") {
      turnosHref = "/user";
      turnosLabel = "Perfil";
    }
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  const controlNavbar = useCallback(() => {
    if (typeof window !== "undefined") {
      if (window.scrollY > lastScrollY) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      setLastScrollY(window.scrollY);
    }
  }, [lastScrollY]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar);
      return () => {
        window.removeEventListener("scroll", controlNavbar);
      };
    }
  }, [controlNavbar]); 

  const handleLogout = () => {
    toast.error("Usuario deslogueado!")
    logout(); 
    router.push("/");
  };

  if (!mounted) {
    return null;
  }

  return (
    <nav
      className={`fixed top-10 left-1/2 z-50 w-[80%] max-w-5xl -translate-x-1/2
      rounded-4xl transition-transform duration-300
      bg-gradient-to-r from-white/20 via-white/10 to-white/10
      backdrop-blur-xl shadow-lg border border-white/20
      flex flex-row px-4 py-4 sm:px-8 sm:py-4 sm:justify-between md:w-1/2 md:gap-8 md:py-3
      ${visible ? "translate-y-0" : "-translate-y-32"}
      items-center`}
    >
      {/* Logo Titulo de la pagina */}
      <h2 className="hidden lg:flex font-great-vibes text-2xl text-white">
        Instaguera
      </h2>

      {/* Links */}
      <ul className="w-full flex items-center justify-evenly gap-4 sm:gap-6 font-semibold text-white">
        <li><a href="#inicio" className="hover:text-indigo-500 transition text-sm sm:text-lg">Inicio</a></li>
        <li><a href="#tattoos" className="hover:text-indigo-500 transition text-sm sm:text-lg">Tattoos</a></li>
        <li><Link href={turnosHref} className="hover:text-indigo-500 transition text-sm sm:text-lg">{turnosLabel}</Link></li>
      </ul>

      {/* Ícono de usuario / logout */}
      <div className="flex items-center ml-auto"> 

        {/* Si hay un user logueado.. */}
        {token ? (
          <Button
            variant="ghost"
            size="icon" 
            onClick={handleLogout}
            className="hidden md:flex text-white hover:bg-white/20 hover:text-red-400 cursor-pointer"
            title="Cerrar Sesión" 
          >
            <LogOut className="h-5 w-5" />
          </Button>
        ) : ( 
          <Button
            asChild 
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 hover:text-indigo-400"
            title="Iniciar Sesión / Registrarse"
          >
            <Link href="/login">
              <User className="h-5 w-5" />
            </Link>
          </Button>
        )}
      </div>
    </nav>
  );
}