import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const handler = NextAuth({
    session: {
      strategy: "jwt",
    },
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      }),
    ],
    callbacks: {
      async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
        return baseUrl; // Redirect to the home page after sign in
      },
    },
  });

export { handler as GET, handler as POST };
