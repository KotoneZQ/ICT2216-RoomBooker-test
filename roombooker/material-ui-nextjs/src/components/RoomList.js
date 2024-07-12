'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import arrowRight from '../public/ArrowRight.png';

const RoomList = ({ rooms }) => {
    const handleBook = (room) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('roomType', JSON.stringify({ value: room.room_id, label: room.name }));
        }
    };

    return (
        <div style={{
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(https://royel-react.vercel.app/_next/static/media/bd-room.fef29643.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: '#f0f0f0',
        }}>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '45px',
                padding: '40px',
                maxWidth: '1400px',
                margin: 'auto'
            }}>
                {rooms.map((room) => {
                    const [isHovered, setIsHovered] = useState(false);

                    return (
                        <div
                            key={room.room_id}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                backgroundColor: 'white',
                                padding: '20px',
                                cursor: 'pointer',
                                position: 'relative',
                                border: '1px solid #ccc',
                                borderRadius: '5px',
                                height: '500px',
                            }}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            <h4 style={{ fontSize: '24px' }}>
                                <Link href={`/rooms/${room.room_id}`} passHref style={{
                                    textDecoration: 'none',
                                    color: 'inherit'
                                }}>
                                    <span
                                        style={{
                                            textDecoration: 'none',
                                            color: isHovered ? 'darkgoldenrod' : 'inherit',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {room.name}
                                    </span>
                                </Link>
                            </h4>
                            <p style={{ fontSize: '18px' }}>$ {room.price} / day</p>
                            <Image
                                src={room.image_url}
                                alt={room.name}
                                layout='responsive'
                                width={350}
                                height={350}
                                style={{
                                    zIndex: 1,
                                    transition: 'opacity 0.5s ease'
                                }}
                            />
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '36%',
                                    left: 0,
                                    width: '100%',
                                    height: '50%',
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    display: isHovered ? 'block' : 'none',
                                    textAlign: 'center',
                                    padding: '15px',
                                    borderRadius: '5px',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                    zIndex: 2,
                                    transition: 'opacity 0.5s ease, transform 0.5s ease'
                                }}
                            >
                                <p style={{ fontSize: '16px' }}>
                                    {room.description}
                                </p>
                                <p style={{ fontSize: '14px' }}>
                                    Capacity: {room.capacity}
                                </p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    {!isHovered ? (
                                        <h4 style={{ fontSize: '16px'}}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}> 
                                                <span style={{
                                                    color: 'darkgoldenrod',
                                                    cursor: 'pointer',
                                                    display: 'none' // Initially hidden
                                                }}></span>
                                                <Image src={arrowRight} alt="Arrow Right" width={18} height={18} style={{marginLeft: '10px' }} />
                                            </div>
                                        </h4>
                                    ) : (
                                        <Link href={`/booking`} onClick={handleBook(room)} passHref style={{
                                            textDecoration: 'none',
                                            color: 'inherit'
                                        }}>
                                            <h4 style={{ fontSize: '16px'}}>
                                                <div style={{ display: 'flex', alignItems: 'center' }}> 
                                                    <span style={{
                                                        color: 'darkgoldenrod',
                                                        cursor: 'pointer',
                                                        display: 'inline-block' // Visible upon hover
                                                    }}>BOOK NOW</span>
                                                    <Image src={arrowRight} alt="Arrow Right" width={18} height={18} style={{ marginLeft: '10px' }} />
                                                </div>
                                            </h4>
                                        </Link>
                                    )}
                                </div>
                            </div>


                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RoomList;
