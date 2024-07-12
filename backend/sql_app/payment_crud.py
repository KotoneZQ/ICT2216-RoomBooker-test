from sqlalchemy.orm import Session
from datetime import datetime
from . import models, schemas


def create_payment(db: Session, payment: schemas.PaymentCreate, payment_id: str, payment_at: datetime, reservation_id: int):
    db_payment = models.Payment(
        payment_id=payment_id,
        payment_at=payment_at,
        paid_amount=payment.paid_amount,
        reservation_id=reservation_id
    )
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    return db_payment


def update_payment_status(db: Session, payment_id: str):
    payment = db.query(models.Payment).filter(
        models.Payment.payment_id == payment_id).first()
    if payment:
        payment.payment_status = 'succeeded'
        db.commit()
        db.refresh(payment)
    return payment


def delete_payment(db: Session, reservation_id: int):
    payment = db.query(models.Payment).filter(
        models.Payment.reservation_id == reservation_id).first()
    if payment:
        db.delete(payment)
        db.commit()
        return "200"
    return "400"
