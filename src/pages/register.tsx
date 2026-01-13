
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { registerUser, RegisterInput } from '../services/auth';

export default function Register() {
  const [form, setForm] = useState<RegisterInput>({
    email: '',
    password: '',
    userName: '',
  });

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      alert(data.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-96 space-y-4">
        <h1 className="text-xl font-bold">Register</h1>

        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <input
          placeholder="userName"
          value={form.userName}
          onChange={(e) => setForm({ ...form, userName: e.target.value })}
        />


        <button type="submit">
          {mutation.isPending ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
}
