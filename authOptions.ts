import NextAuth from "next-auth/next";
// import CredentialsProvider from "next-auth/providers/credentials";
import SpotifyProvider from "next-auth/providers/spotify";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import createUser from "./actions/createUser";
import { LoginSchema } from "./schemas";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { users } from "@/schema";
import { eq } from "drizzle-orm";

const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/",
    signOut: "/",
    error: "/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID as any,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET as any,
      authorization:
        "https://accounts.spotify.com/authorize?scope=user-read-email+user-read-private+playlist-read-private+user-top-read+user-follow-read+playlist-read-collaborative",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "username", type: "text", placeholder: "username" },
        password: { label: "password", type: "password" },
      },
      // this will be called when we sign in with normal credentials
      async authorize(credentials: any): Promise<any> {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          // authenticate the user
          const { username, password } = validatedFields.data;
          try {
            const res = await db
              .select({
                username: users.username,
                password: users.password,
              })
              .from(users)
              .where(eq(username as any, users.username));
            // Search for the user by username

            // If user is not found or it was registered via spotify login, throw an error
            if (res.length === 0 || !res[0].password) {
              console.log(res);
              throw new Error("Username does not exist");
            }
            // Compare provided password with the hashed password in the database
            const match = await bcrypt.compare(password, res[0].password);

            // If passwords do not match, throw an error
            if (!match) {
              throw new Error("Passwords not matching");
            }
            return res[0];
          } catch (error) {
            console.error("Authentication error:", error);
            throw error;
          }
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }: any): Promise<any> {
      if (account.provider === "spotify") {
        console.log(account);
        /*user object has details from spotify account, looks like this: 
          {
            id: '31wlnie55epplz45o62tp66peuba',
            name: 'ricky',
            email: 'email@gmail.com',
            image: undefined
          }
        */
        // will create user in database if they're new
        const stringData = await createUser(user.email, user.name, user.id);
        const obj = JSON.parse(stringData);
        // transfer database userId to user since we need to store it in session
        user.userId = obj.userId;
        return true;
      } else if (account.provider === "credentials") {
        // we already have all the necessary data from authorize(), just return true
        return true;
      }
    },
    // transfer user data to token object
    // dont transfer anything that could be changed once the user has logged in
    async jwt({ token, user, account }: any) {
      if (account?.provider === "spotify") {
        // console.log(
        //   "in jwt(). u signed in with spotify. token is ",
        //   token,
        //   " user is ",
        //   user,
        //   " account is ",
        //   account,
        // );
        token.accessToken = account.access_token;
        token.userId = user.userId;
        token.username = user.email;
      } else if (account?.provider === "credentials") {
        // get all the info that should be stored in session
        token.userId = user.userId;
        token.username = user.username;
      }
      return token;
    },
    // transfer token data to session object
    async session({ session, token }: any) {
      session.user.userId = token.userId;
      session.user.accessToken = token.accessToken; // for development purposes
      session.user.username = token.username;
      // console.log('in session(). sessio is ', session);
      return session;
    },
  },
};

export default authOptions;
