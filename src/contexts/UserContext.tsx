import Cookies from 'js-cookie';
import { api } from '../services/api';
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { AdmContextType } from '../types/AdmContextTypes';
import { UserType } from '../types/UserTypes';
import { TokensType } from '../types/TokensTypes';
import { ApiResponse } from '../types/ApiTypes';

export const UserContext = createContext<AdmContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);
  const [tokens, setTokens] = useState<TokensType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const navigate = useNavigate();

  useEffect(() => {
    const getCookies = Cookies.get('E-Ducar@user@auth');
    const sessionData = sessionStorage.getItem('E-Ducar@user@auth');

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
      sessionStorage.setItem('E-Ducar@user@auth', getCookies);
    }

    setUser(user);
    setTokens(tokens);
    setIsLoading(false);
  }, []);

  const login = useCallback(
    async (username: string, password: string, keepLogin: boolean) => {
      try {
        const {
          data: { success, type, data },
        } = await api.put<ApiResponse>('/authAdm/login', {
          username,
          password,
        });

        if (!success) {
          return { success, type, data };
        }

        const parsedData: {
          user: UserType;
          tokens: TokensType;
        } = JSON.parse(data);

        const { user: findUser, tokens: findTokens } = parsedData;

        setUser(findUser);
        setTokens(findTokens);

        sessionStorage.setItem(
          'E-Ducar@user@auth',
          JSON.stringify({ user: findUser, tokens: findTokens }),
        );
        if (keepLogin) {
          Cookies.set(
            'E-Ducar@user@auth',
            JSON.stringify({ user: findUser, tokens: findTokens }),
          );
        }

        navigate('/adm/UserCreate');

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
        '/authAdm/logout',
        { id: user?.id },
        {
          headers: {
            'x-access-token': tokens?.accessToken,
          },
        },
      );

      if (!success) {
        return { success, type, data };
      }

      setUser(null);
      setTokens(null);

      sessionStorage.removeItem('E-Ducar@user@auth');
      Cookies.remove('E-Ducar@user@auth');

      return { success, type, data };
    } catch (error) {
      console.error(error);

      return { success: false, type: 0, data: JSON.stringify(error) };
    }
  }, [user, tokens]);

  const updateUser = useCallback(async () => {
    try {
      const {
        data: { success, type, data },
      } = await api.post<ApiResponse>(
        '/users/getById',
        { id: user?.id },
        {
          headers: {
            'x-access-token': tokens?.accessToken,
          },
        },
      );

      if (!success) {
        return { success, type, data };
      }

      const parsedData: UserType = JSON.parse(data);

      setUser(parsedData);

      sessionStorage.setItem(
        'E-Ducar@user@auth',
        JSON.stringify({ user: parsedData, tokens }),
      );

      Cookies.remove('E-Ducar@user@auth');

      return { success, type, data: 'Atualizado com sucesso' };
    } catch (error) {
      console.error(error);

      return { success: false, type: 0, data: JSON.stringify(error) };
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
    [login, logout, updateUser, user, tokens, isLoading],
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}
