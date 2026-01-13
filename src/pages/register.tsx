// import { useState } from 'react';
// import { useMutation } from '@tanstack/react-query';
// import { registerUser, RegisterInput } from '../services/auth';
// import { Button } from '../component/Button';
// import { FormInput } from '../component/FormInput';


// export default function Register() {
//   const [form, setForm] = useState<RegisterInput>({
//     email: '',
//     password: '',
//     blogName: '',
//     blogSlug: '',
//   });

//   const mutation = useMutation({
//     mutationFn: registerUser,
//     onSuccess: (data) => {
//       alert(data.message);
//       setForm({ email: '', password: '', blogName: '', blogSlug: '' });
//     },
//     onError: (error: any) => {
//       alert(error.message);
//     },
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     mutation.mutate(form);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-8 rounded shadow-md w-full max-w-md"
//       >
//         <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

//         <input
//           name="email"
//           type="email"
//           placeholder="Email"
//           value={form.email}
//           onChange={handleChange}
//           className="w-full mb-4 p-2 border rounded"
//           required
//         />
//         <input
//           name="password"
//           type="password"
//           placeholder="Password"
//           value={form.password}
//           onChange={handleChange}
//           className="w-full mb-4 p-2 border rounded"
//           required
//         />
//         <input
//           name="blogName"
//           type="text"
//           placeholder="Blog Name"
//           value={form.blogName}
//           onChange={handleChange}
//           className="w-full mb-4 p-2 border rounded"
//           required
//         />
//         <input
//           name="blogSlug"
//           type="text"
//           placeholder="Blog Slug"
//           value={form.blogSlug}
//           onChange={handleChange}
//           className="w-full mb-4 p-2 border rounded"
//           required
//         />

//         <button
//           type="submit"
//           className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
//         >
//           {mutation.isLoading ? 'Registering...' : 'Register'}
//         </button>
//       </form>
//     </div>
//   );
// }


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
