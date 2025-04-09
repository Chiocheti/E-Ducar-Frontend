import { ApiResponse } from './ApiTypes';
import { TokensType } from './TokensTypes';
import { UserType } from './UserTypes';

export type AdmContextType = {
  login: (
    username: string,
    password: string,
    keepLogin: boolean,
  ) => Promise<ApiResponse>;
  logout: () => Promise<ApiResponse>;
  updateUser: () => Promise<ApiResponse>;
  user: UserType | null;
  tokens: TokensType | null;
  isLoading: boolean;
};
