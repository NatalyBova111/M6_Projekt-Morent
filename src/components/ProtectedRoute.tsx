import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";

type Props = {
  children: React.ReactNode;
};

export const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // пока грузим сессию Supabase
  if (loading) {
    return null; // можно потом поставить красивый loader
  }

  // если не залогинен — отправляем на /login
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;

  }

  return <>{children}</>;
};
