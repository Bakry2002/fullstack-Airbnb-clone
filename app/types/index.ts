import { User, Listing } from '@prisma/client';

// this is the type of the user object that will be returned by getCurrentUser()
export type SafeUser = Omit<
    User,
    'createdAt' | 'updatedAt' | 'emailVerified'
> & {
    createdAt: string;
    updatedAt: string;
    emailVerified: string | null;
};

export type safeListing = Omit<Listing, 'createdAt'> & {
    createdAt: string;
};
