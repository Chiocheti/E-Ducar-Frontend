export type UserType = {
  id: string;
  username: string;
  name: string;
  isTeacher: boolean;
  image: string;
};

export type TokensType = {
  accessToken: string;
  refreshToken: string;
};

export type ApiResponse<T = unknown> = {
  success: boolean;
  data: T;
  error: string | null;
};

export type AuthContextType = {
  login: (username: string, password: string, keepLogin: boolean) => Promise<{
    success: boolean;
    data: string | null;
    error: string | null;
  }>;
  logout: () => Promise<{
    success: boolean;
    data: string | null;
    error: string | null;
  }>;
  updateUser: () => Promise<{
    success: boolean;
    data: string | null;
    error: string | null;
  }>;
  user: UserType | null;
  tokens: TokensType | null;
  isLoading: boolean;
};
