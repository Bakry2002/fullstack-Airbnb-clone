import bcrypt from 'bcrypt';
import prisma from '@/app/libs/prismadb';
import { NextResponse } from 'next/server';

export const POST = async (req: Request) => {
    const body = await req.json(); // get the body of the request, in our case, the name, email and password
    const { name, email, password } = body; // destructure the body

    // after receiving the body including the password of course, lets hashed it to make it more secure
    const hashedPassword = await bcrypt.hash(password, 12);

    // create the user
    const user = await prisma.user.create({
        data: {
            name,
            email,
            hashedPassword,
        },
    });

    // return the user
    return NextResponse.json(user);
};
