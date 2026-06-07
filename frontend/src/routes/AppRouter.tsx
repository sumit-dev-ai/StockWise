import { createBrowserRouter, Navigate, Outlet, RouterProvider } from "react-router-dom";
import { LoginPage } from "../pages/auth/LoginPage";
import { ProtectedRoute } from "./ProtectedRoute";
import {AppLayout} from "../components/layout/AppLayout"
import { DashboardPage } from "../pages/dashboard/DashboardPage";
import { AuthProvider } from "../context/AuthContext";
import { StoreSetupPage } from "../pages/store/StoreSetupPage";

const AuthWrapper = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};

const router = createBrowserRouter([
  {
    element: <AuthWrapper />,
    children: [
      {
      index: true,
      element: <Navigate to="/login" replace />
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/store-setup",
        element: <StoreSetupPage />,
      },
      {
        path: "/store-setup",
        element: <StoreSetupPage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AppLayout />,
            children: [
              {
                path: "/dashboard",
                element: <DashboardPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};