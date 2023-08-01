import prisma from '@/app/libs/prismadb';
import getCurrentUser from './getCurrentUser';

export default async function getFavoriteListings() {
    try {
        //get current user
        const currentUser = await getCurrentUser();

        // check if user is logged in, if not return empty array
        if (!currentUser) {
            return [];
        }

        // get all the favorites id that match the current user favoritesIds array
        const favorites = await prisma.listing.findMany({
            where: {
                id: {
                    in: [...(currentUser.favoritesIds || [])],
                },
            },
        });

        const safeFavorites = favorites.map((favorite) => ({
            ...favorite,
            createdAt: favorite.createdAt.toISOString(),
        }));

        return safeFavorites;
    } catch (error: any) {
        throw new Error(error);
    }
}
