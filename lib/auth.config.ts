import type { NextAuthConfig } from "next-auth"
import GitHub from "next-auth/providers/github"

export const authConfig: NextAuthConfig = {
  providers: [GitHub({})],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isProtected = nextUrl.pathname.startsWith("/dashboard")

      if (isProtected && !isLoggedIn) return false
      return true
    }
  }
}