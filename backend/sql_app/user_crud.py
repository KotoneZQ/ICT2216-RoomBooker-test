from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from fastapi import Request, HTTPException

from send_email import send_email_to_verify, send_email_to_otp
from otp_helper import generate_otp
from password_helper import hash_password, verify_password, check_password_complexity
from . import models, schemas
import datetime
import sys
import os
from dotenv import load_dotenv

load_dotenv() # take environment variables

MAX_FAILED_ATTEMPTS = 5
LOCKOUT_DURATION = timedelta(minutes=10)
#  User Table
user_not_found = schemas.UserRead(
    user_id=-1,
    username="",
    email="not_found@mail.com",
    password="",
    verified=False,
    login_req_2fa=False,
    firstname="",
    lastname="",
    phone="",
    role=""
)


# User Table


def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.user_id == user_id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, user: schemas.UserCreate):
    if not check_password_complexity(user.password):
        raise HTTPException(status_code=400, detail="Password does not meet complexity requirements.")

    db_user = models.User(
        email=user.email,
        username=user.username,
        password=hash_password(user.password),
        firstname=user.firstname,
        lastname=user.lastname,
        phone=user.phone,
        role=user.role  # Assign a default role, you can change this as needed
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    print(db_user)
    sys.stdout.flush()
    return db_user


def delete_user(db: Session, email: str):
    try:
        user_to_delete = get_user_by_email(db, email)
        if user_to_delete:
            otp_entries = db.query(models.OTP).filter(
                models.OTP.user_id == user_to_delete.user_id).all()
            for otp_entry in otp_entries:
                db.delete(otp_entry)
            db.delete(user_to_delete)
            db.commit()
            return {"success": "200", "message": "User deleted"}
        else:
            return {"success": "400", "message": "User not found."}
    except Exception as e:
        db.rollback()
        print(f"Error deleting user: {e}")
        return {"success": "400", "message": str(e)}


def user_login(request: Request, db: Session, user: schemas.UserLogin) -> dict:
    FRONTEND_BASE_URL = os.environ['FRONTEND_BASE_URL']
    cur_user = get_user_by_email(db, user.email)
    res = {"success": "400", "route": "/landing", "message": "No user found"}

    if cur_user:
        if cur_user.lockout_until and cur_user.lockout_until > datetime.datetime.now():
            return {"success": "403", "message": "Your account is locked. Please wait 10 minutes before trying again."}

        if verify_password(user.password, cur_user.password):
            cur_user.failed_attempts = 0
            cur_user.lockout_until = None
            db.commit()

            # Verified is after registration
            if not cur_user.verified:
                res = {
                    "success": "200",
                    "route": "/landing",
                    "email": user.email,
                    "user_id": cur_user.user_id,
                    "role": cur_user.role,  # Include role
                }
                otp = generate_otp(db, cur_user.user_id)
                hashed_link = hash_password(otp)
                url = f"{FRONTEND_BASE_URL}/verify_acc/{user.email}/{hashed_link}"
                print("URL: ", url)

                send_email_to_verify(cur_user.email, url)
            else:
                route = "/landing"
                otp_purpose = ""

                if cur_user.login_req_2fa:
                    route = "/otp"
                    otp = generate_otp(db, cur_user.user_id)
                    send_email_to_otp(cur_user.email, otp, "login_account")
                    otp_purpose = "login_account"

                res = {
                    "success": "200",
                    "route": route,
                    "email": user.email,
                    "user_id": cur_user.user_id,
                    "username": cur_user.username,
                    "role": cur_user.role,  # Include role
                    "otp_purpose": otp_purpose
                }
            print("Response from user_crud: ", res)
        else:
            cur_user.failed_attempts += 1
            if cur_user.failed_attempts >= MAX_FAILED_ATTEMPTS:
                cur_user.lockout_until = datetime.datetime.now() + LOCKOUT_DURATION
            db.commit()
            return {"success": "403", "message": "Invalid credentials. Account will be locked after 5 failed attempts."}
    else:
        return {"success": "403", "message": "Invalid credentials."}

    return res


def get_valid_otp_entry(db: Session, user_id: int):
    otp_entry = db.query(models.OTP).filter(
        models.OTP.user_id == user_id).first()

    if otp_entry:
        now = datetime.datetime.now()
        expires_at = otp_entry.expires_at
        print("OTP expire time is\t", expires_at)
        print("OTP current time is\t", now)
        if expires_at > now:
            return otp_entry
    return -1


def verify_otp(db: Session, user_id: int, userVerify: schemas.UserVerify) -> bool:
    otp_entry = db.query(models.OTP).filter(
        models.OTP.user_id == user_id, models.OTP.otp == userVerify.otp).first()

    res = {"status": "Invalid OTP"}
    if otp_entry:
        print("OTP Entry: ", otp_entry.otp)
        now = datetime.datetime.now()
        expires_at = otp_entry.expires_at
        print("OTP expire time is\t", expires_at)
        print("OTP current time is\t", now)
        if expires_at > now:
            db.delete(otp_entry)
            res['status'] = userVerify.otp_purpose
            print(res['status'])
            db.commit()

    return res


def update_password(db: Session, db_user, user: schemas.UserChangePassword):
    ##if not check_password_complexity(user.password):
      ##  raise HTTPException(status_code=400, detail="New password does not meet complexity requirements.")

    db_user.password = hash_password(user.password)
    db.commit()


def get_user_by_id(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.user_id == user_id).first()


def toggle_2fa(db: Session, db_user, user: schemas.UserToggle2FA):
    db_user.login_req_2fa = user.login_req_2fa
    db.commit()


def update_profile(db: Session, db_user, user: schemas.UserUpdate):
    db_user.username = user.username
    db_user.firstname = user.firstname
    db_user.lastname = user.lastname
    db_user.phone = user.phone
    db.commit()