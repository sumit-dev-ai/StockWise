import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();
  if (loading) {
    return (<div className="flex items-center justify-center">
            <h1 className="animate-pulse">Loading...</h1>
    </div>);
  }

  if (!isAuthenticated) {
    navigate("/login")
  }

  return <Outlet/>

}