export interface RegisterDto {
  email: string;
  password: string;
  userName: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
}
