import { ReactNode, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StudentContext } from '../contexts/StudentContext';
import { StudentContextType } from '../types/StudentContextTypes';

export default function StudentPrivate({ children }: { children: ReactNode }) {
  const context = useContext<StudentContextType | null>(StudentContext);
  const navigate = useNavigate();

  if (!context) {
    throw new Error('Falta contexto');
  }

  const { isLoading, student } = context;

  useEffect(() => {
    if (!isLoading && !student) {
      navigate('/student');
    }
  }, [isLoading, student, navigate]);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!student) {
    return null;
  }

  return children;
}
