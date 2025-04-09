import { ApiResponse } from './ApiTypes';
import { StudentType } from './StudentTypes';
import { TokensType } from './TokensTypes';

export type StudentContextType = {
  login: (email: string, password: string) => Promise<ApiResponse>;
  logout: () => Promise<ApiResponse>;
  updateStudent: () => Promise<ApiResponse>;
  student: StudentType | null;
  tokens: TokensType | null;
  isLoading: boolean;
};
