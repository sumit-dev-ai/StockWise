import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { LoginPage } from "../pages/auth/LoginPage";
import { ProtectedRoute } from "./ProtectedRoute";
import {AppLayout} from "../components/layout/AppLayout"
import { DashboardPage } from "../pages/dashboard/DashboardPage";
import { AuthProvider } from "../context/AuthContext";

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
        path: "/login",
        element: <LoginPage />,
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