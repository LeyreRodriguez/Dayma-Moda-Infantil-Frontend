import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function AdminRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  if (loading) return null;

  console.log(user);
  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
