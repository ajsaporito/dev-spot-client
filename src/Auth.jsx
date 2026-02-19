import { Navigate, Outlet } from "react-router-dom";
import { getToken } from "./api/client";

export default function Auth() {
  const token = getToken();
  if (token) return <Navigate to="/" replace />;
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Outlet />
    </div>
  );
}
