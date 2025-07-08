import Cookies from 'js-cookie';
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

import { ApiResponse } from '../types/ApiTypes';
import { api } from '../services/api';

import { StudentContextType } from '../types/StudentContextTypes';
import { StudentType } from '../types/StudentTypes';
import { TokensType } from '../types/TokensTypes';

export const StudentContext = createContext<StudentContextType | null>(null);

export function StudentProvider({ children }: { children: ReactNode }) {
  const [student, setStudent] = useState<StudentType | null>(null);
  const [tokens, setTokens] = useState<TokensType | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);

  const navigate = useNavigate();

  useEffect(() => {
    const getCookies = Cookies.get('E-Ducar@student@auth');
    const sessionData = sessionStorage.getItem('E-Ducar@student@auth');

    let studentData: StudentType | null = null;
    let tokensData: TokensType | null = null;

    if (getCookies) {
      const parsedData = JSON.parse(getCookies);
      studentData = parsedData.student;
      tokensData = parsedData.tokens;
    } else if (sessionData) {
      const parsedData = JSON.parse(sessionData);
      studentData = parsedData.student;
      tokensData = parsedData.tokens;
    }

    if (!sessionData && getCookies) {
      sessionStorage.setItem('E-Ducar@student@auth', getCookies);
    }

    setStudent(studentData);

    setTokens(tokensData);

    setLoading(false);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const {
          data: { success, type, data },
        } = await api.put<ApiResponse>('/authStudent/login', {
          email,
          password,
          time: moment().format('YYYY-MM-DD HH:mm:ss'),
        });

        if (!success) {
          return { success, type, data };
        }

        const parseData: {
          student: StudentType;
          tokens: TokensType;
        } = JSON.parse(data);

        const { student: findStudent, tokens: findTokens } = parseData;

        setStudent(findStudent);
        setTokens(findTokens);

        sessionStorage.setItem(
          'E-Ducar@student@auth',
          JSON.stringify({ student: findStudent, tokens: findTokens }),
        );

        navigate('/student/registration');

        return { success, type, data: 'Login feito com sucesso' };
      } catch (error) {
        console.error(error);

        return { success: false, type: 0, data: JSON.stringify(error) };
      }
    },
    [navigate],
  );

  const logout = useCallback(async () => {
    try {
      const {
        data: { success, type, data },
      } = await api.put<ApiResponse>(
        '/authStudent/logout',
        { id: student?.id },
        {
          headers: {
            'x-access-token': tokens?.accessToken,
          },
        },
      );

      if (!success) {
        return { success, type, data };
      }

      setStudent(null);
      setTokens(null);

      sessionStorage.removeItem('E-Ducar@student@auth');

      return { success, type, data };
    } catch (error) {
      console.error(error);

      return { success: false, type: 0, data: JSON.stringify(error) };
    }
  }, [student, tokens]);

  const updateStudent = useCallback(async () => {
    try {
      const {
        data: { success, type, data },
      } = await api.post<ApiResponse>(
        '/students/getById',
        { id: student?.id, registrations: false },
        {
          headers: {
            'x-access-token': tokens?.accessToken,
          },
        },
      );

      if (!success) {
        return { success, type, data };
      }

      const parseData: StudentType = JSON.parse(data);

      setStudent(parseData);

      sessionStorage.setItem(
        'E-Ducar@student@auth',
        JSON.stringify({ student: parseData, tokens }),
      );

      Cookies.remove('E-Ducar@user@auth');

      return { success, type, data: 'Atualizado com sucesso' };
    } catch (error) {
      console.error(error);

      return { success: false, type: 0, data: JSON.stringify(error) };
    }
  }, [student, tokens]);

  const contextValue = useMemo(
    () => ({
      login,
      logout,
      updateStudent,
      student,
      tokens,
      isLoading,
    }),
    [login, logout, updateStudent, student, tokens, isLoading],
  );

  return (
    <StudentContext.Provider value={contextValue}>
      {children}
    </StudentContext.Provider>
  );
}
