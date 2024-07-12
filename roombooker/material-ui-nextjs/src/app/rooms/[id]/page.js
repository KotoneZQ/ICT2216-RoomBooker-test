import React from 'react';
import RoomDetail from '../../../components/RoomDetail';

const BACKEND_API_URL=process.env.BACKEND_API_URL

async function fetchRoomData(id) {
  const res = await fetch(`${BACKEND_API_URL}/rooms/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch room data');
  }
  const room = await res.json();
  return room;
}

export default async function RoomDetailPage({ params }) {
  const room = await fetchRoomData(params.id);

  return <RoomDetail room={room} />;
}

// This function is optional, use it to generate static params for SSG (Static Site Generation)
// export async function generateStaticParams() {
//   const res = await fetch(`${BACKEND_API_URL}/rooms`);
//   const rooms = await res.json();

//   return rooms.map(room => ({
//     id: room.room_id.toString(),
//   }));
// }
