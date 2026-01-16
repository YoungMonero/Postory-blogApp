
// import { useState } from 'react';
// import { useMutation } from '@tanstack/react-query';
// import { registerUser, RegisterInput } from '../services/auth';

// export default function Register() {
//   const [form, setForm] = useState<RegisterInput>({
//     email: '',
//     password: '',
//     userName: '',
//   });

//   const mutation = useMutation({
//     mutationFn: registerUser,
//     onSuccess: (data) => {
//       alert(data.message);
//     },
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     mutation.mutate(form);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       <form onSubmit={handleSubmit} className="w-96 space-y-4">
//         <h1 className="text-xl font-bold">Register</h1>

//         <input
//           placeholder="Email"
//           value={form.email}
//           onChange={(e) => setForm({ ...form, email: e.target.value })}
//         />
//         <input
//           placeholder="Password"
//           type="password"
//           value={form.password}
//           onChange={(e) => setForm({ ...form, password: e.target.value })}
//         />
//         <input
//           placeholder="userName"
//           value={form.userName}
//           onChange={(e) => setForm({ ...form, userName: e.target.value })}
//         />


//         <button type="submit">
//           {mutation.isPending ? 'Registering...' : 'Register'}
//         </button>
//       </form>
//     </div>
//   );
// }


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