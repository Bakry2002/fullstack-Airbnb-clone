import prisma from '@/app/libs/prismadb';
import { NextResponse } from 'next/server';
import getCurrentUser from '@/app/actions/getCurrentUser';

interface IParams {
    listingId?: string;
}

export async function DELETE(req: Request, { params }: { params: IParams }) {
    // get current user
    const currentUser = await getCurrentUser();

    // check if there is a user
    if (!currentUser) {
        return NextResponse.error();
    }

    // destruct params
    const { listingId } = params;

    // check if the id of the listings is valid
    if (!listingId || typeof listingId !== 'string') {
        throw new Error('Invalid ID 😞.');
    }

    // get listing to be deleted
    const listing = await prisma.listing.deleteMany({
        where: {
            id: listingId,
            userId: currentUser.id, //  only the owner of the listing can delete it
        },
    });

    // after that, return the listings
    return NextResponse.json(listing);
}
