import ProtectedRoute from "@/components/ProtectedRoute";

export default function UserLayout({ children }: { children: React.ReactNode }) {




    return (
        <ProtectedRoute roles={["CLIENTE"]}>
            <div className="p-4">{children}</div>
        </ProtectedRoute>
    );
}