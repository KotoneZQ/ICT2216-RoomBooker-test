from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sql_app.database import get_db
from sql_app import schemas, payment_crud, models, reservation_crud, user_crud
import stripe
import os
from datetime import datetime

router = APIRouter()

stripe.api_key = os.environ['STRIPE_SECRET_KEY']


@router.post("/create-payment-intent/")
async def create_payment_intent(payment: schemas.PaymentCreate, db: Session = Depends(get_db)):
    try:
        # Validate check-in and check-out dates
        check_in_date = payment.check_in_date.date()
        check_out_date = payment.check_out_date.date()
        today = datetime.now().date()

        if check_in_date <= today:
            raise HTTPException(
                status_code=400, detail="Check-in date must be at least one day after today.")

        if check_out_date <= check_in_date:
            raise HTTPException(
                status_code=400, detail="Check-out date must be later than check-in date.")

        # Fetch the actual room price from the database
        room = db.query(models.Room).filter(
            models.Room.room_id == payment.room_id).first()

        if not room:
            raise HTTPException(status_code=404, detail="Room not found")

        days_difference = (check_out_date - check_in_date).days
        expected_amount = room.price * payment.room_count * days_difference

        # Validate the price
        if expected_amount != payment.paid_amount:
            raise HTTPException(
                status_code=400, detail="Invalid payment amount")

        # Create a reservation if payment succeeded
        reservation = schemas.ReservationCreate(
            user_id=payment.user_id,
            start_date=check_in_date,
            end_date=check_out_date,
            total_price=expected_amount
        )
        created_reservation = reservation_crud.create_reservation(
            db, reservation)
        reservation_id = created_reservation.reservation_id

        # Create a PaymentIntent with the order amount and currency
        intent = stripe.PaymentIntent.create(
            # Stripe expects the amount in cents
            amount=int(expected_amount * 100),
            currency='sgd',
        )

        # Set the payment_at field to the current time
        payment_at = datetime.now()
        payment_id = intent['id']
        db_payment = payment_crud.create_payment(
            db, payment, payment_id, payment_at, reservation_id)

        return {
            "clientSecret": intent['client_secret'],
            "reservation_id": reservation_id
        }

    except stripe.error.StripeError as e:
        # Handle Stripe API errors
        raise HTTPException(status_code=400, detail=f"Stripe error: {str(e)}")
    except Exception as e:
        # Handle other errors
        raise HTTPException(status_code=400, detail=f"Error: {str(e)}")


@router.post("/update-payment-status/")
async def update_payment_status(payment_update: schemas.PaymentUpdateStatus, db: Session = Depends(get_db)):
    try:
        payment = payment_crud.update_payment_status(
            db, payment_update.payment_id)
        if not payment:
            raise HTTPException(status_code=404, detail="Payment not found")

        if payment_update.payment_status == 'succeeded':
            # Insert into room_reserved table
            room_reserved = models.RoomReserved(
                reservation_id=payment_update.reservation_id,
                room_id=payment_update.room_id,
                price=payment_update.total_price
            )
            db.add(room_reserved)
            db.commit()

            # Update reservation table's reservation status
            reservation_update = reservation_crud.update_reservation_status(
                db, payment_update.reservation_id)
            if not reservation_update:
                raise HTTPException(
                    status_code=404, detail="Reservation not found")

        return {
            "payment_id": payment.payment_id,
            "reservation_id": payment.reservation_id,
            "payment_date": payment.payment_at
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/delete-payment-intent")
async def delete_payment_intent(user_id: int, db: Session = Depends(get_db)):
    # get user_id that has a reservation
    success_code = "200"
    message = "delete payment success"

    user_reservation = reservation_crud.get_reservation(
        db, user_id=user_id)
    if not user_reservation:
        success_code = "400"
        message += "no reservation found\n"
    print("Reservation is : ", user_reservation.reservation_status)

    reservation_id = user_reservation.reservation_id
    print("Reservation ID is : ", reservation_id)
    if payment_crud.delete_payment(db, reservation_id) == "400":
        success_code = "400"
        message += "delete payment failed\n"

    if reservation_crud.delete_reservation(db, user_reservation.reservation_id) == "400":
        success_code = "400"
        message += "delete reservation failed\n"
    print(message)

    return {"success": success_code, "message": message}
