import { NextResponse } from 'next/server';
import { getSession } from '../../../lib/session';

export async function POST(request) {
    try {
        const bookingDetails = await request.json();
        const response = new NextResponse();
        const session = await getSession(request, response);
        session.bookingDetails = bookingDetails;
        await session.save();
        return response;
    } catch (error) {
        console.error(error.message);
        return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
}