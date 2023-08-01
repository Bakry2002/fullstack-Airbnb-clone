import prisma from '@/app/libs/prismadb';

export interface IListingsParams {
    userId?: string;
}

export default async function getListings(params: IListingsParams) {
    try {
        const { userId } = params;

        let query: any = {};

        if (userId) {
            query.userId = userId;
        }

        // get all listings
        const listings = await prisma.listing.findMany({
            orderBy: {
                createdAt: 'desc', // get the latest listings first
            },
        });

        const safeListings = listings.map((listing) => ({
            ...listing,
            // update the date to be string instead of date object
            createdAt: listing.createdAt.toISOString(),
        }));

        return safeListings;
    } catch (error: any) {
        throw new Error(error);
    }
}
