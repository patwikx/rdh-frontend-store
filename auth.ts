import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { authConfig } from "./auth.config"
import { getUserById } from "@/data/user"
import { getAccountByUserId } from "./data/account"
import prismadb from "./lib/db"

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  update,
} = NextAuth({
  adapter: PrismaAdapter(prismadb),
  session: { 
    strategy: "jwt",
    maxAge: 30 * 60, // 30 minutes in seconds
  },
  ...authConfig,
  pages: {
    signIn: "/auth/sign-in",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true
      const existingUser = await getUserById(user.id)
      if (!existingUser?.emailVerified) return true
      return true
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      if (session.user) {
        session.user.name = token.name as string
        session.user.email = token.email
        session.user.id = token.id as string
      }
      return session
    },
    async jwt({ token }) {
      if (!token.sub) return token
      const existingUser = await getUserById(token.sub)
      if (!existingUser) return token
      const existingAccount = await getAccountByUserId(existingUser.id)
      token.isOAuth = !!existingAccount
      token.firstName = existingUser.firstName
      token.lastName = existingUser.lastName
      token.email = existingUser.email
      token.id = existingUser.id
      return token
    },
  },
})