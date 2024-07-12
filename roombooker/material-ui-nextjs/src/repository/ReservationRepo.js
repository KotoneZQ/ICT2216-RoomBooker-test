"use server";
const BACKEND_API_URL=process.env.BACKEND_API_URL;

export async function getReservations(userId) {      
    try {
        const response = await fetch(`${BACKEND_API_URL}/reservations/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
        },
        cache: 'no-store',
        });
    
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error("Reservations data fetching response not ok: " + errorData.detail || 'Failed to get reservation data');
        }
        return response.json();
    } catch (error) {
      throw error;
    }
  }
