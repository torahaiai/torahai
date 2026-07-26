import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import pool from '../../../lib/db';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { rows } = await pool.query('select * from users where email = $1', [credentials.email]);
        const user = rows[0];
        if (!user) return null;

        const valid = await bcrypt.compare(credentials.password, user.password_hash);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.full_name,
          subscription_status: user.subscription_status,
        };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.subscription_status = user.subscription_status;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.subscription_status = token.subscription_status;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
