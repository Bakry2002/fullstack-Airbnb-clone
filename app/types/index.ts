import { User, Listing, Reservation } from '@prisma/client';

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

export type SafeReservation = Omit<
    Reservation,
    'createdAt' | 'startDate' | 'endDate' | 'listing'
> & {
    createdAt: string;
    startDate: string;
    endDate: string;
    listing: safeListing;
};
