import { ReactNode, useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { AuthContextType } from "../types/AuthContext.types";
import { useNavigate } from "react-router-dom";

export default function Private({ children }: { children: ReactNode }) {
  const context = useContext<AuthContextType | null>(AuthContext);
  const navigate = useNavigate();

  if (!context) {
    throw new Error("Falta contexto");
  }

  const { isLoading, user } = context;

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/");
    }
  }, [isLoading, user, navigate]);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    return null;
  }

  return children;
}
