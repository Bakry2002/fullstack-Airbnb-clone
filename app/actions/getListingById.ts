import prisma from '@/app/libs/prismadb';

interface IParams {
    listingId: string;
}

export default async function getListingById(params: IParams) {
    try {
        // get the listing id from the params
        const { listingId } = params;

        // get the listing by id
        const listing = await prisma.listing.findUnique({
            where: {
                id: listingId,
            },
            include: {
                // include the user object
                user: true,
            },
        });

        // if listing is not found
        if (!listing) {
            return null;
        }

        // create a safe listing object
        const safeListing = {
            ...listing,
            // update the date to be string instead of date object
            createdAt: listing.createdAt.toISOString(),
            // spread the use object
            user: {
                ...listing.user,
                createdAt: listing.user.createdAt.toISOString(),
                updatedAt: listing.user.updatedAt.toISOString(),
                emailVerified:
                    listing.user.emailVerified?.toISOString() || null,
            },
        };

        //  return the safe listing
        return safeListing;
    } catch (error: any) {
        throw new Error(error);
    }
}
