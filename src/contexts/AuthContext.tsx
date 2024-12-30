import Cookies from 'js-cookie';
import { api } from '../services/api';
import { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthContextType, UserType, TokensType, ApiResponse } from '../types/AuthContext.types';

type LoginResponse = {
  user: UserType;
  tokens: TokensType;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);
  const [tokens, setTokens] = useState<TokensType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const navigate = useNavigate();

  useEffect(() => {
    const getCookies = Cookies.get('E-Ducar@auth');
    const sessionData = sessionStorage.getItem('E-Ducar@auth');

    let user: UserType | null = null;
    let tokens: TokensType | null = null;

    if (getCookies) {
      const parsedData = JSON.parse(getCookies);
      user = parsedData.user;
      tokens = parsedData.tokens;
    } else if (sessionData) {
      const parsedData = JSON.parse(sessionData);
      user = parsedData.user;
      tokens = parsedData.tokens;
    }

    if (!sessionData && getCookies) {
      sessionStorage.setItem('E-Ducar@auth', getCookies);
    }

    setUser(user);
    setTokens(tokens);
    setIsLoading(false);
  }, []);

  const login = useCallback(
    async (username: string, password: string, keepLogin: boolean) => {
      try {
        const { data: { success, data, error } } = await api.post<ApiResponse<LoginResponse | null>>(
          '/auth/login',
          { username, password },
        );

        if (!success || data === null) {
          return { success, data: null, error };
        }

        const { user: findUser, tokens: findTokens } = data;

        setUser(findUser);
        setTokens(findTokens);

        sessionStorage.setItem('E-Ducar@auth', JSON.stringify({ user: findUser, tokens: findTokens }));
        if (keepLogin) {
          Cookies.set('E-Ducar@auth', JSON.stringify({ user: findUser, tokens: findTokens }));
        }

        navigate('/CreateUser');

        return { success, data: 'Login feito com Sucesso', error: null };
      } catch (error) {
        console.error(error);

        return { success: false, data: null, error: JSON.stringify('Houve um erro interno') };
      }
    }, [navigate]);

  const logout = useCallback(async () => {
    try {
      const { data: { success, data, error } } = await api.put<ApiResponse<string | null>>(
        '/auth/logout', { id: user?.id },
        {
          headers: {
            'x-access-token': tokens?.accessToken,
          },
        }
      );

      if (!success || !data) {
        return { success, data, error };
      }

      setUser(null);
      setTokens(null);

      sessionStorage.removeItem('E-Ducar@auth');
      Cookies.remove('E-Ducar@auth');

      return { success, data: 'Deslogado com sucesso', error: null };
    } catch (error) {
      console.error(error);
      return { success: false, data: null, error: JSON.stringify('Houve um erro interno') };
    }
  }, [user, tokens]);

  const updateUser = useCallback(async () => {
    try {
      const { data: { success, data, error } } = await api.post<ApiResponse<UserType | null>>
        ('/users/getById', { id: user?.id }, {
          headers: {
            'x-access-token': tokens?.accessToken,
          },
        });

      if (!success || data === null) {
        return { success, data: null, error };
      }

      setUser(data);

      sessionStorage.setItem('E-Ducar@auth', JSON.stringify({ user: data, tokens }));

      Cookies.remove('E-Ducar@auth');

      return { success, data: 'Usuario atualizado com sucesso', error: null };
    } catch (error) {
      console.error(error);

      return { success: false, data: null, error: JSON.stringify('Houve um erro interno') };
    }
  }, [user, tokens]);

  const contextValue = useMemo(
    () => ({
      login,
      logout,
      updateUser,
      user,
      tokens,
      isLoading,
    }),
    [login, logout, updateUser, user, tokens, isLoading]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}
