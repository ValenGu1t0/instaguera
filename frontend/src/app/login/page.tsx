"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { AuthResponse } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Error en login");

      const data: AuthResponse = await res.json();

      login(data.token, data.user);

      console.log(data.user)

      router.push("/");         // home o lo que sea que quiera despues je

    } catch (err) {

      setError("Credenciales inválidas");
      console.error(err);
    }
  };

  return (

  <div className="flex flex-col justify-center items-center w-screen h-screen">

    <form
      onSubmit={handleSubmit}
      className="flex flex-col p-6 gap-4 bg-gray-400 rounded-xl text-black w-1/2"
    >
      <input
        className="bg-white border border-blue-100 p-1"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="bg-white border border-blue-100 p-1"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit" className="p-2 bg-amber-600 rounded-lg">Login</button>
      {error && <p>{error}</p>}
    </form>

  </div>
  );
}
