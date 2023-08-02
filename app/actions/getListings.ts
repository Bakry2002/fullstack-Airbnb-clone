import prisma from '@/app/libs/prismadb';

export interface IListingsParams {
    userId?: string;
    guestCount?: number;
    roomCount?: number;
    bathroomCount?: number;
    startDate?: string;
    endDate?: string;
    locationValue?: string;
    category?: string;
}

export default async function getListings(params: IListingsParams) {
    try {
        const {
            userId,
            guestCount,
            roomCount,
            bathroomCount,
            startDate,
            endDate,
            locationValue,
            category,
        } = params;

        let query: any = {};

        if (userId) {
            query.userId = userId;
        }
        if (locationValue) {
            query.locationValue = locationValue;
        }
        if (category) {
            query.category = category;
        }
        if (guestCount) {
            query.guestCount = {
                gte: +guestCount,
            };
        }
        if (roomCount) {
            query.roomCount = {
                gte: +roomCount,
            };
        }
        if (bathroomCount) {
            query.bathroomCount = {
                gte: +bathroomCount,
            };
        }

        // select date that are not already selected for this reservation
        if (startDate && endDate) {
            query.NOT = {
                reservations: {
                    some: {
                        OR: [
                            {
                                startDate: { gte: startDate },
                                endDate: { lte: endDate },
                            },
                            {
                                startDate: { lte: endDate },
                                endDate: { gte: endDate },
                            },
                        ],
                    },
                },
            };
        }

        // get all listings
        const listings = await prisma.listing.findMany({
            where: query,
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
