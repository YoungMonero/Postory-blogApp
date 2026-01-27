// src/services/auth.ts
// THE THE HHDFFHVGHGG
export interface RegisterInput {
  email: string;
  password: string;
 userName: string;
  
}

export interface LoginDto {
  email: string;
  password: string;
}

export async function registerUser(data: RegisterInput) {
  const res = await fetch('http://localhost:4000/auth/register', {
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
  const res = await fetch('http://localhost:4000/auth/login', {
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
