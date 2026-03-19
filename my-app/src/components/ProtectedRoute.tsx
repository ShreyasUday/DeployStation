import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <h2 style={{ color: "var(--accent)" }}>Loading...</h2>
            </div>
        );
    }

    if (user === null) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}
