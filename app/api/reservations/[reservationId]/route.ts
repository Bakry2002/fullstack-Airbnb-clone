import prisma from '@/app/libs/prismadb';
import { NextResponse } from 'next/server';
import getCurrentUser from '@/app/actions/getCurrentUser';

interface IParams {
    reservationId: string;
}

export async function DELETE(req: Request, { params }: { params: IParams }) {
    // get current user from session
    const currentUser = await getCurrentUser();

    // check if there is no user in session
    if (!currentUser) return NextResponse.error();

    // destruct the reservationId from params
    const { reservationId } = params;

    // check if this reservationId is valid
    if (!reservationId || typeof reservationId !== 'string') {
        throw new Error('Invalid ID 😞.');
    }

    // delete the reservation by certain queries, which is:
    // no one can delete the reservation except the user who made the reservation or the user who made the listing that the reservation is made for
    const reservation = await prisma.reservation.deleteMany({
        where: {
            id: reservationId,
            OR: [
                { userId: currentUser.id },
                { listing: { userId: currentUser.id } },
            ],
        },
    });

    // if everything is ok, redirect to reservations page
    return NextResponse.json(reservation);
}
