import ProtectedRoute from "@/components/ProtectedRoute";

export default function DuenoLayout({ children }: { children: React.ReactNode }) {
    
    return (
        <ProtectedRoute roles={["ADMIN", "DUENO"]}>
            {children}
        </ProtectedRoute>
    );
}