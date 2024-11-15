import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcryptjs from "bcryptjs"

import { LoginSchema } from "@/schemas"
import { getUserByEmail } from "@/data/user"

export const authConfig = {
  pages: {
    signIn: "/auth/sign-in",
  },
  callbacks: {
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith(`/`)
      const isOnAuth = nextUrl.pathname.startsWith('/auth')

      if (isOnAuth) {
        if (isLoggedIn) {
          return Response.redirect(new URL(`/`, nextUrl))
        }
        return true
      }

      if (isOnDashboard) {
        if (isLoggedIn) return true
        return Response.redirect(new URL('/auth/sign-in', nextUrl))
      }

      return true
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials)

        if (validatedFields.success) {
          const { email, password } = validatedFields.data

          const user = await getUserByEmail(email)
          if (!user || !user.password) return null

          const passwordsMatch = await bcryptjs.compare(password, user.password)

          if (passwordsMatch) return user
        }

        return null
      },
    }),
  ],
} satisfies NextAuthConfig