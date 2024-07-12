from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sql_app import models, schemas
from sql_app.database import get_db

router = APIRouter()

@router.get("/rooms", response_model=List[schemas.Room])
async def read_rooms(db: Session = Depends(get_db)):
    rooms = db.query(models.Room).all()
    return rooms

@router.get("/rooms/{room_id}", response_model=schemas.Room)
def read_room(room_id: int, db: Session = Depends(get_db)):
    room = db.query(models.Room).filter(models.Room.room_id == room_id).first()
    if room is None:
        raise HTTPException(status_code=404, detail="Room not found")
    return room

@router.get("/room-price/{room_id}", response_model=schemas.RoomPrice)
def get_room_price(room_id: int, db: Session = Depends(get_db)):
    room = db.query(models.Room).filter(models.Room.room_id == room_id).first()
    if room is None:
        raise HTTPException(status_code=404, detail="Room not found")
    return {"price": room.price}

@router.get("/verify-room-details/{room_id}/{name}")
async def verify_room_details(room_id: int, name: str, db: Session = Depends(get_db)):
    room = db.query(models.Room).filter(models.Room.room_id == room_id, models.Room.name == name).first()
    if room:
        return {"message": "Room details are valid", "valid": True}
    else:
        raise HTTPException(status_code=404, detail="Room not found or details do not match")
    
@router.get("/reservations/{user_id}", response_model=List[schemas.Reservation])
async def get_reservations_history(user_id: int, db: Session = Depends(get_db)):
    reservations = (
        db.query(models.Reservation)
        .join(models.RoomReserved, models.Reservation.reservation_id == models.RoomReserved.reservation_id)
        .join(models.Room, models.RoomReserved.room_id == models.Room.room_id)
        .filter(models.Reservation.user_id == user_id)
        .order_by(models.Reservation.reservation_id)
        .all()
    )

    result = []

    if not reservations:
        return result
    
    for reservation in reservations:
        room = db.query(models.Room).join(models.RoomReserved).filter(models.RoomReserved.reservation_id == reservation.reservation_id).first()
        result.append(schemas.Reservation(
            reservation_id=reservation.reservation_id,
            user_id=reservation.user_id,
            start_date=reservation.start_date,
            end_date=reservation.end_date,
            total_price=reservation.total_price,
            room=room
        ))
    return result