from sqlalchemy.orm import Session
from . import models, schemas


def create_reservation(db: Session, reservation: schemas.ReservationCreate):
    db_reservation = models.Reservation(
        user_id=reservation.user_id,
        start_date=reservation.start_date,
        end_date=reservation.end_date,
        total_price=reservation.total_price,
    )
    db.add(db_reservation)
    db.commit()
    db.refresh(db_reservation)
    return db_reservation


def update_reservation_status(db: Session, reservation_id: int):
    reservation = db.query(models.Reservation).filter(
        models.Reservation.reservation_id == reservation_id).first()
    if reservation:
        reservation.reservation_status = 'confirmed'
        db.commit()
        db.refresh(reservation)
    return reservation


def get_room_reserved(db: Session, reservation_id: int):
    return


def get_reservation(db: Session, user_id: int):
    return db.query(models.Reservation).filter(models.Reservation.user_id == user_id).first()


def delete_reservation(db: Session, reservation_id: int):
    room_reserved = db.query(models.RoomReserved).filter(
        models.RoomReserved.reservation_id == reservation_id).first()

    reservation = db.query(models.Reservation).filter(
        models.Reservation.reservation_id == reservation_id).first()

    if reservation and room_reserved:
        db.delete(room_reserved)
        print("1 Room reserved deleted")
        db.delete(reservation)
        print("2 Reservation deleted")
        db.commit()
    return reservation
