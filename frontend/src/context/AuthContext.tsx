import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

import { api } from "../api/authApi";
import {useNavigate} from "react-router-dom";
import type { User, UserAuthContextType } from "../types/auth.types";

const AuthContext = createContext<UserAuthContextType | null>(null);

type AuthProviderProps={
    children : ReactNode;
}

export const AuthProvider = ({children}:AuthProviderProps) => {
const [user , setUser] = useState<User | null>(null);
const [loading , setLoading] = useState(true);
const navigate = useNavigate();

const checkAuth= useCallback(async () => {

    try {
        setLoading(true);
        const response = await api.get("/auth/me");
        console.log("Auth COntext debugger : ",response);
        setUser(response.data.data.user)

    } catch (error) {
        setUser(null);
        console.log(error)
    }finally{
        setLoading(false);
    }
},[]);

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.log("Logout failed:", error);
    } finally {
      setUser(null);
      navigate("/login", { replace: true });
    }
  };

useEffect(() => {
    checkAuth();
  }, [checkAuth]);

const value: UserAuthContextType = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    checkAuth,
    logout,
  };

return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;

}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};