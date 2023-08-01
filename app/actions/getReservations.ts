import prisma from '@/app/libs/prismadb';

interface IParams {
    listingId?: string;
    userId?: string;
    authorId?: string;
}

export default async function getReservations(params: IParams) {
    try {
        // destructure the params
        const { listingId, userId, authorId } = params;

        // create a query object that will be used to query the database and be shown to the user in the url
        const query: any = {}; // create an empty query object

        // if we query using listingId, we will find all reservations for that listing id
        if (listingId) {
            query.listingId = listingId;
        }
        // if we query using userId, we will find all reservations for that user id
        if (userId) {
            query.userId = userId;
        }
        // if we query using authorId, we will find all reservations for that other users made for our listings.
        if (authorId) {
            query.listing = { userId: authorId };
        }

        //  try to get all reservations
        const reservations = await prisma.reservation.findMany({
            where: query,
            include: {
                // include the listing object
                listing: true,
            },
            orderBy: {
                createdAt: 'desc', // get the latest reservations first
            },
        });

        const safeReservations = reservations.map((reservation) => ({
            ...reservation,
            // update the date to be string instead of date object
            createdAt: reservation.createdAt.toISOString(),
            startDate: reservation.startDate.toISOString(),
            endDate: reservation.endDate.toISOString(),
            listing: {
                ...reservation.listing,
                createdAt: reservation.listing.createdAt.toISOString(),
            },
        }));
        return safeReservations;
    } catch (error: any) {
        throw new Error(error);
    }
}
