import prisma from '@/app/libs/prismadb';
import { NextResponse } from 'next/server';
import getCurrentUser from '@/app/actions/getCurrentUser';

export const POST = async (req: Request) => {
    // get current user
    const currentUser = await getCurrentUser();

    // if no user, return error
    if (!currentUser) {
        return NextResponse.error();
    }

    // get the body of the request
    const body = await req.json();

    // destructure the body
    const { listingId, startDate, endDate, totalPrice } = body;

    if (!listingId || !startDate || !endDate || !totalPrice) {
        return NextResponse.error();
    }

    // update a listing with the creation of the reservation for that listing
    const listingAndReservation = await prisma.listing.update({
        where: {
            id: listingId,
        },
        data: {
            reservations: {
                create: {
                    userId: currentUser.id,
                    startDate,
                    endDate,
                    totalPrice,
                },
            },
        },
    });

    // return the listing and reservation to the client
    return NextResponse.json(listingAndReservation);
};
