"use server";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const SESSION_PASSWORD = process.env.NEXT_PUBLIC_SESSION_PASSWORD

export const getStripeApiKey = async() => {
    return BACKEND_API_URL;
}

export const getSessionPassword = async() => {
    // console.log("this is the password in action.js:", SESSION_PASSWORD);
    return SESSION_PASSWORD;
}