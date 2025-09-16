"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function NavBar() {
    
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const controlNavbar = () => {
    if (typeof window !== "undefined") {
      if (window.scrollY > lastScrollY) {
        // scrolleando hacia abajo -> ocultar navbar
        setVisible(false);
      } else {
        // scrolleando hacia arriba -> mostrar navbar
        setVisible(true);
      }
      setLastScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar);
      return () => {
        window.removeEventListener("scroll", controlNavbar);
      };
    }
  }, [lastScrollY]);

  return (
    <nav
      className={`fixed top-10 left-1/2 z-50 w-[80%] max-w-5xl -translate-x-1/2 
      rounded-4xl transition-transform duration-300
      bg-gradient-to-r from-white/20 via-white/10 to-white/10
      backdrop-blur-xl shadow-lg border border-white/20
      flex flex-row px-4 py-2 sm:px-8 sm:py-4 sm:justify-between md:w-1/2 md:gap-8
      ${visible ? "translate-y-0" : "-translate-y-32"}`}
    >
      {/* Logo */}
      <Link href="/" className="text-xl font-semibold italic text-white hidden sm:flex">
        Instaguera
      </Link>

      {/* Links */}
      <ul className="w-full flex items-center justify-evenly gap-6 font-semibold text-white">
        <li><Link href="/" className="hover:text-indigo-500 transition md:text-lg">About</Link></li>
        <li><Link href="#tattoos" className="hover:text-indigo-500 transition md:text-lg">Tattoos</Link></li>
        <li><Link href="/turnos" className="hover:text-indigo-500 transition md:text-lg">Turnos</Link></li>
      </ul>
    </nav>
  );
}
