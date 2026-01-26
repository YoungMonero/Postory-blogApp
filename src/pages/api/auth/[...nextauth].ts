import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";

export default NextAuth({
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],

  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },
});