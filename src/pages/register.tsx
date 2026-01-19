


import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { registerUser } from '../services/auth';
import { useAuth } from '../hooks/useAuth';

export default function Register() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    userName: '',
  });

  const router = useRouter();
  const auth = useAuth();

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      auth.login(data.accessToken, data.userName);
      router.push('/');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
      <input placeholder="Password" type="password" onChange={e => setForm({ ...form, password: e.target.value })} />
      <input placeholder="Username" onChange={e => setForm({ ...form, userName: e.target.value })} />
      <button type="submit">Register</button>
    </form>
  );
}