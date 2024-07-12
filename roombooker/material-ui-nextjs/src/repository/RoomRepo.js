"use server";

const BACKEND_API_URL = process.env.BACKEND_API_URL;

export async function getRooms() {
    try {
      const response = await fetch(`${BACKEND_API_URL}/rooms`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error("Room fetching response not ok:" + response.statusText);
      }
  
      return response.json();
    
    } catch (error) {
      throw error;
    }
}
  
export async function getRoomPrice(roomId) {
    try {
      const response = await fetch(`${BACKEND_API_URL}/room-price/${roomId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error("Room price fetching response not ok:" + response.statusText);
      }
  
      return response.json();
    } catch (error) {
      throw error;
    }
}  

export async function verifyRoomDetails(id, name) {
  try {
    const response = await fetch(`${BACKEND_API_URL}/verify-room-details/${id}/${encodeURIComponent(name)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error("Room details verification response was not ok:" + response.statusText);
    }

    return response.json();
  } catch (error) {
    throw error;
  }
}
