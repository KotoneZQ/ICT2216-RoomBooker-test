import { NextResponse } from 'next/server';
import { getSession } from '../../../lib/session';

// export const dynamic = "force-dynamic"

export async function GET(req) {
  const session = await getSession(req, NextResponse);
  const bookingDetails = session.bookingDetails || 'No Booking Details Stored!';
  return NextResponse.json({ bookingDetails });
  // try {

  // } catch (error) {
  //   console.error(error.message);
  //   return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  // }
}