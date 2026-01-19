// import { useState } from 'react';
// import { useMutation } from '@tanstack/react-query';

// import { login } from '../services/auth';
// import { FormInput } from '../component/FormInput';

// import { Button } from '../component/Button';

// import { LoginDto } from '../types/auth';

// export default function Login() {
//   const [form, setForm] = useState<LoginDto>({
//     email: '',
//     password: '',
//   });

//   const mutation = useMutation({
//     mutationFn: login,
//     onSuccess: (data) => {
//       alert(`Logged in! Token: ${data.accessToken}`);
//     },
//     onError: (err: any) => {
//       alert(err.response?.data?.message || 'Error');
//     },
//   });

//   const handleChange = (key: keyof LoginDto, value: string) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     mutation.mutate(form);
//   };

//   return (
//     <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
//       <h1 className="text-2xl font-bold mb-4">Login</h1>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <FormInput
//           label="Email"
//           value={form.email}
//           onChange={(val) => handleChange('email', val)}
//         />

//         <FormInput
//           label="Password"
//           type="password"
//           value={form.password}
//           onChange={(val) => handleChange('password', val)}
//         />

//         <Button type="submit" disabled={mutation.isPending}>
//           {mutation.isPending ? 'Logging in...' : 'Login'}
//         </Button>
//       </form>
//     </div>
//   );
// }


import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';


import { login as loginApi } from '../services/auth';
import { FormInput } from '../component/FormInput';
import { Button } from '../component/Button';
import { LoginDto } from '../types/auth';

export default function Login() {
  const router = useRouter();

  const [form, setForm] = useState<LoginDto>({
    email: '',
    password: '',
  });

  const mutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      // ✅ STORE TOKEN
      localStorage.setItem('accessToken', data.accessToken);

      // ✅ REDIRECT TO DASHBOARD
      router.push('/dashboard');
    },
    onError: (err: any) => {
      alert(err.message || 'Login failed');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Login</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label="Email"
          value={form.email}
          onChange={(val) => setForm({ ...form, email: val })}
        />

        <FormInput
          label="Password"
          type="password"
          value={form.password}
          onChange={(val) => setForm({ ...form, password: val })}
        />

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </div>
  );
}
