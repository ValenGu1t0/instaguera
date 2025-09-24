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
    if (user?.role === "ADMIN"  || user?.role === "DUENO") {
      turnosHref = "/admin/turnos";
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
      flex flex-row px-4 py-2 sm:px-8 sm:py-4 sm:justify-between md:w-1/2 md:gap-8
      ${visible ? "translate-y-0" : "-translate-y-32"}
      items-center`}
    >
      {/* Logo */}
      <Link href="/" className="text-xl font-semibold italic text-white hidden sm:flex">
        Instaguera
      </Link>

      {/* Links */}
      <ul className="w-full flex items-center justify-evenly gap-4 sm:gap-6 font-semibold text-white">
        <li><Link href="/" className="hover:text-indigo-500 transition text-md md:text-lg">Inicio</Link></li>
        <li className="hidden sm:flex"><Link href="#tattoos" className="hover:text-indigo-500 transition text-md md:text-lg">Tattoos</Link></li>
        <li><Link href={turnosHref} className="hover:text-indigo-500 transition text-md md:text-lg">{turnosLabel}</Link></li>
      </ul>

      {/* Ícono de usuario / logout */}
      <div className="flex items-center ml-auto"> 

        {/* Si hay un user logueado.. */}
        {token ? (
          <Button
            variant="ghost"
            size="icon" 
            onClick={handleLogout}
            className="text-white hover:bg-white/20 hover:text-red-400 cursor-pointer"
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