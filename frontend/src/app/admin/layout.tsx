import ProtectedRoute from "@/components/ProtectedRoute";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    
    return (
        <ProtectedRoute roles={["ADMIN", "DUENO"]}>
            <div className="p-4">{children}</div>
        </ProtectedRoute>
    );
}