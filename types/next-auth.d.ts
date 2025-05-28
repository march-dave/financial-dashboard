import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    accessToken?: string
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
} 