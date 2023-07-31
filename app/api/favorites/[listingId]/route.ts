import prisma from '@/app/libs/prismadb';
import { NextResponse } from 'next/server';
import getCurrentUser from '@/app/actions/getCurrentUser';

interface Favorite {
    listingId?: string;
}

export const POST = async (req: Request, { params }: any) => {
    const currentUser = await getCurrentUser(); // Get current user

    // check if there is no user
    if (!currentUser) {
        return NextResponse.error();
    }

    // extract listings from our params
    const { listingId } = params;

    // check if the listingId exist and its of type string
    if (!listingId || typeof listingId !== 'string') {
        throw new Error('Invalid ID!');
    }

    // create favorites id array from the user favorites
    let favoritesIds = [...(currentUser.favoritesIds || [])]; // create a copy of the favoritesIds

    // push the listingId to the favoritesIds array
    favoritesIds.push(listingId);

    // now, update user favoritesIds with the new array
    const user = await prisma.user.update({
        where: {
            id: currentUser.id,
        },
        data: {
            favoritesIds,
        },
    });

    // after updating the user, return the user
    return NextResponse.json(user);
};

// create the delete from favorites function
export const DELETE = async (req: Request, { params }: { params: any }) => {
    // get the current user
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.error();
    }

    // extract the listingId from the params
    const { listingId } = params;

    // check if the listingId exist and its of type string
    if (!listingId || typeof listingId !== 'string') {
        throw new Error('Invalid ID!');
    }

    // update the user favoritesIds by filtering the listingId
    let favoritesIds = [...(currentUser.favoritesIds || [])].filter(
        (id) => id !== listingId,
    );

    // update the user favoritesIds
    const user = await prisma.user.update({
        where: {
            id: currentUser.id,
        },
        data: {
            favoritesIds,
        },
    });

    // return the user
    return NextResponse.json(user);
};
