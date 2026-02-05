<<<<<<< HEAD
=======
// src/services/auth.ts
// import { api } from './api';
>>>>>>> 9305c5f69f161ba01e2cd45183a14578d9110f98
export interface RegisterInput {
  email: string;
  password: string;
 username: string;
  
}

export interface LoginDto {
  email: string;
  password: string;
}

export async function registerUser(data: RegisterInput) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${apiUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Registration failed');
  }

  return res.json();
}

export async function login(data: LoginDto) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const res = await fetch(`${apiUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Login failed');
  }

  return res.json();
}
