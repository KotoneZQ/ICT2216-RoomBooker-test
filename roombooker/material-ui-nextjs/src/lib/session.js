"use server";
// lib/session.js
import { getIronSession } from 'iron-session';
import { getSessionPassword } from '@/action/action';

let sessionOptions = {}

async function initSessionOptions() {
  const password = await getSessionPassword();
  sessionOptions = {
    password: password || "change-this-this-is-not-a-secure-password",
    cookieName: 'tmp_booking_details',
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
  };
}

/**
 * Get the session for the request and response.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<IronSession>}
 */
export const getSession = async (req, res) => {
  if (!sessionOptions.password) {
    await initSessionOptions();
    // console.log("this is in session.js:", sessionOptions.password);
  }
  const session = await getIronSession(req, res, sessionOptions);
  return session;
};