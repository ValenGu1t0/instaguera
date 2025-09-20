"use client";

import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: string[]; // opcional: ["ADMIN"], ["CLIENTE"], etc
}

export default function ProtectedRoute({ children, roles }: ProtectedRouteProps) {

    const { token, user } = useAuthStore();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        // Si no hay token, redirigimos al login
        if (!token) {
            router.replace("/login");
            return;
        }

        // Si hay roles definidos y el usuario no cumple
        if (roles && user && !roles.includes(user.role)) {
            router.replace("/"); // o a una página 403
            return;
        }

        setIsAuthorized(true);
    }, [token, user, roles, router]);

    if (!isAuthorized) {
        return null; // o un spinner de carga
    }

    return <>{children}</>;
}