"use client";

import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: string[];
}

export default function ProtectedRoute({ children, roles }: ProtectedRouteProps) {

    const { token, user } = useAuthStore();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {

        if (!token) {
        router.replace("/login");
        return;
        }

        if (roles && user && !roles.includes(user.role)) {
        router.replace("/"); 
        return;
        }

        setIsAuthorized(true);
        setLoading(false);
    }, [token, user, roles, router]);

    if (loading) {
        return (
        <div className="flex items-center justify-center h-screen">
            <p className="text-lg text-indigo-500">Cargando...</p>
        </div>
        );
    }

    if (!isAuthorized) return null;

    return <>{children}</>;
}