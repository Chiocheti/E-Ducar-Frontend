import { ReactNode, useContext, useEffect } from 'react';
import { UserContext } from '../contexts/UserContext';
import { AdmContextType } from '../types/AdmContextTypes';
import { useNavigate } from 'react-router-dom';

export default function UserPrivate({ children }: { children: ReactNode }) {
  const context = useContext<AdmContextType | null>(UserContext);
  const navigate = useNavigate();

  if (!context) {
    throw new Error('Falta contexto');
  }

  const { isLoading, user } = context;

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/adm');
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
