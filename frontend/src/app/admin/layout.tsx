import PageTransition from "@/components/PageTransition";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    
    return (
        <ProtectedRoute roles={["ADMIN"]}>
            <PageTransition>
                {children}
            </PageTransition>
        </ProtectedRoute>
    );
}