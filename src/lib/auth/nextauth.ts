import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { createUserAccount, signInUserAccount } from "./providers";
import { apiService } from "@/services/apiService";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        userName: { label: "User Name", type: "text" },
        mode: { label: "Mode", type: "text" }, // "signin" or "signup"
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const { email, password, userName, mode } = credentials as {
          email: string;
          password: string;
          userName?: string;
          mode: string;
        };

        try {
          let firebaseUser;

          if (mode === "signup") {
            if (!userName) {
              throw new Error("User name is required for signup");
            }

            // Firebase認証でユーザー作成
            firebaseUser = await createUserAccount(email, password, userName);

            // FastAPIにユーザー情報を保存
            await apiService.setupUser({
              userId: firebaseUser.uid,
              userName: userName,
              email: email,
            });
          } else {
            // Firebase認証でログイン
            firebaseUser = await signInUserAccount(email, password);
          }

          return {
            id: firebaseUser.uid,
            email: firebaseUser.email!,
            name: firebaseUser.displayName || userName || "",
          };
        } catch (error) {
          console.error("Authentication error:", error);
          throw new Error(
            error instanceof Error ? error.message : "Authentication failed"
          );
        }
      },
    }),
  ],
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7日間
    updateAge: 24 * 60 * 60, // 24時間ごとに更新
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60, // 7日間
  },
});
