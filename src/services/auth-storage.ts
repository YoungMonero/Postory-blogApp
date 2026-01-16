// export function getToken(): string | null {
//   if (typeof window === 'undefined') return null;
//   return localStorage.getItem('accessToken');
// }

// export function logout() {
//   localStorage.removeItem('accessToken');
// }




// src/services/auth-storage.ts
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken'); // ✅ match login
}

export function setToken(token: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('accessToken', token); // ✅ match login
}

export function clearToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('accessToken');
}
