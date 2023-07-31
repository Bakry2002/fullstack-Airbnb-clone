import prisma from '@/app/libs/prismadb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export const getSession = async () => {
    return await getServerSession(authOptions);
};

export default async function getCurrentUser() {
    try {
        const session = await getSession();

        if (!session?.user?.email) return null;

        const currentUser = await prisma.user.findUnique({
            where: {
                email: session.user.email as string,
            },
        });

        // user not found or if there is no current user logged in
        if (!currentUser) return null;

        // if everything is ok, return the user
        return {
            ...currentUser,
            createdAt: currentUser.createdAt.toISOString(), // convert to ISO string to avoid JSON.stringify() error and hydration errors in the client
            updatedAt: currentUser.updatedAt.toISOString(),
            emailVerified: currentUser.emailVerified?.toISOString() || null,
        };
    } catch (error: any) {
        return null;
    }
}
