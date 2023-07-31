import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth, { AuthOptions } from 'next-auth';

//? providers
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
//? prisma client instance
import prisma from '@/app/libs/prismadb';
import CredentialsProvider from 'next-auth/providers/credentials';

//? bcrypt
import bcrypt from 'bcrypt';

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        // github provider
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        }),
        // google provider
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        // facebook provider
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID as string,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
        }),
        // credentials provider
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'email', type: 'text' },
                password: { label: 'password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Invalid credentials');
                }

                // find the user by email
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user || !user?.hashedPassword) {
                    throw new Error('Invalid credentials');
                }

                //  check if the password entered by the user is correct
                const isPasswordCorrect = await bcrypt.compare(
                    credentials.password,
                    user.hashedPassword,
                );

                // if the password is incorrect
                if (!isPasswordCorrect) {
                    throw new Error('Invalid credentials');
                }

                // if everything is correct, return the user
                return user;
            },
        }),
    ],
    pages: {
        signIn: '/', // redirect to home page if something goes wrong
    },
    debug: process.env.NODE_ENV === 'development', // only enable debug mode in development
    session: {
        strategy: 'jwt', // use jwt strategy for session, meaning that the session will be stored in a cookie
    },
    secret: process.env.NEXTAUTH_SECRET, // secret for jwt
};

export default NextAuth(authOptions); // export the next auth function with the options object we just created
