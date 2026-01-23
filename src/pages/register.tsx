
// import { useState } from 'react';
// import { useMutation } from '@tanstack/react-query';
// import { useRouter } from 'next/router';
// import { registerUser } from '../services/auth';
// import { useAuth } from '../hooks/useAuth';

// export default function Register() {
//   const [form, setForm] = useState({
//     email: '',
//     password: '',
//     username: '',
//   });

//   const router = useRouter();
//   const auth = useAuth();

//   const mutation = useMutation({
//     mutationFn: registerUser,
//     onSuccess: (data) => {
//       auth.login(data.accessToken, data.username);
//       router.push('/');
//     },
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     mutation.mutate(form);
//   };

//   return (
//     <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
//       <h1 className="text-2xl font-bold mb-4">Register</h1>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
//           placeholder="Email"
//           value={form.email}
//           onChange={(e) =>
//             setForm({ ...form, email: e.target.value })
//           }
//         />

//         <input
//           className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
//           placeholder="Password"
//           type="password"
//           value={form.password}
//           onChange={(e) =>
//             setForm({ ...form, password: e.target.value })
//           }
//         />

//         <input
//           className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
//           placeholder="Username"
//           value={form.username}
//           onChange={(e) =>
//             setForm({ ...form, username: e.target.value })
//           }
//         />

//         <button
//           type="submit"
//           disabled={mutation.isPending}
//           className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 disabled:opacity-50"
//         >
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
    username: '',
  });

  const router = useRouter();
  const auth = useAuth();

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      // ✅ Log user in immediately and redirect to homepage/dashboard
      auth.login(data.accessToken, data.username);
      router.push('/'); // redirect to homepage
      // or use router.push('/dashboard') if you prefer dashboard as landing page
    },
    onError: () => {
      // handled below with inline message
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Register</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <input
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          placeholder="Username"
          value={form.username}
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
        />

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 disabled:opacity-50"
        >
          {mutation.isPending ? 'Registering...' : 'Register'}
        </button>
      </form>

      {/* ✅ Inline error message */}
      {mutation.isError && (
        <p className="mt-4 text-red-600 text-sm">
          {(mutation.error as any)?.message || 'Registration failed. Please try again.'}
        </p>
      )}
    </div>
  );
}
