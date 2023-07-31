import prisma from '@/app/libs/prismadb';
import { NextResponse } from 'next/server';
import getCurrentUser from '@/app/actions/getCurrentUser';

export const POST = async (req: Request) => {
    // first get the details of the user who is creating the listing
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.error();
    }

    // get the body of the request, in our case, the details of the listing
    const body = await req.json();
    // destructure the body
    const {
        title,
        description,
        imageSrc,
        category,
        roomCount,
        bathroomCount,
        guestCount,
        location,
        price,
    } = body;

    // create the listing
    const listing = await prisma.listing.create({
        data: {
            title,
            description,
            imageSrc,
            category,
            roomCount,
            bathroomCount,
            guestCount,
            locationValue: location.value,
            price: parseInt(price, 10), // convert the price to a number not a string
            userId: currentUser.id,
        },
    });

    // after creating the listing, return it to the client
    return NextResponse.json(listing);
};
