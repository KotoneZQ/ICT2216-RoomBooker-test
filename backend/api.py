from logger import LOGGING
import uvicorn
import pymongo
from typing import Union, List
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.routing import APIRouter
from starlette.middleware.sessions import SessionMiddleware
from sqlalchemy.orm import Session

from sql_app import user_crud, payment_crud, reservation_crud
from sql_app import models, schemas
from sql_app.database import SessionLocal, engine
from bson import ObjectId
from pymongo import ReturnDocument
from otp_helper import generate_otp
from password_helper import hash_password, verify_password
from send_email import send_email_to_verify, send_email_to_otp
import os
from dotenv import load_dotenv
import logging.config

load_dotenv()  # take environment variables

models.Base.metadata.create_all(bind=engine)


def verify_session(requests: Request):
    username = requests.session.get("username")
    if username is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return username


router = APIRouter(
    prefix="/api",
    tags=["api"],
)

logging.config.dictConfig(LOGGING)

# Logger instance specific to this module
logger = logging.getLogger(__name__)


def get_db():
    db = SessionLocal()
    try:
        print("db: ", db.query(models.User).filter(
            models.User.user_id == 1).first())
        yield db
    finally:
        db.close()


@router.get("/")
async def read_root():
    return {"message": "Hello, World!, what you want"}


@router.post("/user")
async def create_user(request: Request, user: schemas.UserCreate, db: Session = Depends(get_db)):
    FRONTEND_BASE_URL = os.environ['FRONTEND_BASE_URL']
    db_user = user_crud.get_user_by_email(db, email=user.email)
    if db_user:
        return {"success": "400", "message": "Email has already been registered previously. Forgot your password?", "email": {user.email}}

    new_user = user_crud.create_user(db=db, user=user)

    otp = generate_otp(db, new_user.user_id)
    hashed_link = hash_password(otp)

    url = f"{FRONTEND_BASE_URL}/verify_acc/{user.email}/{hashed_link}"
    print("URL: ", url)  # Do not remove this line, this is needed for pytest

    # Send email to user email with the link
    send_email_to_verify(new_user.email, url)

    db.close()
    return {"success": "200", "message": "OTP sent to your email for verification.", "email": {user.email}, "otp_purpose": "create_account"}


@router.post("/delete_user")
async def delete_user(user: schemas.UserDelete, db: Session = Depends(get_db)):
    db_user = user_crud.get_user_by_email(db, email=user.email)
    if not db_user:
        return {"success": "400", "message": "Delete not successful", "email": user.email}

    reservation = reservation_crud.get_reservation(
        db=db, user_id=db_user.user_id)

    if reservation:
        # Delete payment
        payment_crud.delete_payment(
            db=db, reservation_id=reservation.reservation_id)

        # Delete room_reserved and reservation
        reservation_crud.delete_reservation(
            db=db, reservation_id=reservation.reservation_id)

    # Lastly, delete user
    delete_response = user_crud.delete_user(db=db, email=user.email)
    if delete_response["success"] == "200":
        logger.info(
            f"The user with the email {user.email} has been deleted")
        return {"success": "200", "message": f"{user.email} account deleted."}
    else:
        return {"success": "400", "message": f"{user.email} account not deleted."}


@router.get("/user/{user_id}", response_model=schemas.UserRead)
async def get_user_by_id(user_id: int, db: Session = Depends(get_db)):
    db_user = user_crud.get_user_by_id(db, user_id)

    if not db_user:
        return user_crud.user_not_found
    print("api.py (read_user) | Reading user: ", db_user)
    return db_user


@router.get("/user/email/{email}", response_model=schemas.UserRead)
async def get_user_by_email(email: str, db: Session = Depends(get_db)):
    db_user = user_crud.get_user_by_email(db, email)
    if not db_user:
        return user_crud.user_not_found
    db.close()
    return db_user


@router.post("/verify_link")
async def verify_link(user: schemas.UserVerifyAcc, db: Session = Depends(get_db)):
    db_user = user_crud.get_user_by_email(db, email=user.email)

    if not db_user:
        db.close()
        return {"success": "400", "message": "User not found.", "route": "/landing?logincomponent=true"}

    cur_valid_otp = user_crud.get_valid_otp_entry(db, db_user.user_id)
    if (cur_valid_otp != -1 and len(cur_valid_otp.otp) == 6):

        print("AccountVerification: ", hash_password(
            cur_valid_otp.otp), "\t|\t", user.get_verify_link)

        if (verify_password(cur_valid_otp.otp, user.get_verify_link)):
            db.delete(cur_valid_otp)
            db_user.verified = True
            db.commit()
            db.close()
            logger.info(
                f"The user with the email {user.email} has successfully registered an account")
            return {"success": "200", "message": "OTP verified and account created successfully.", "route": "/landing"}

    db.close()
    # # invalid otp, try again i guess
    return {"success": "400", "message": "Invalid link.", "route": "/landing"}


@ router.post("/verify_otp")
async def verify_otp(user: schemas.UserVerify, db: Session = Depends(get_db)):
    db_user = user_crud.get_user_by_email(db, email=user.email)

    if not db_user:
        db.close()
        return {"success": "400", "message": "User not found.", "route": "/landing?login=true"}

    user_verify_otp = user_crud.verify_otp(db, db_user.user_id, user)

    if user_verify_otp['status'] == "forgot_password":
        db.close()
        logger.info(
            f"Password reset attempt has been detected on {user.email} account")
        return {"success": "200", "message": "OTP verified and forgot password successfully.", "route": "/changepassword",  "email": user.email}

    if user_verify_otp['status'] == "login_account":
        res = {"success": "200",
               "route": "/landing",
               "message": "OTP verified and login successfully",
               "email": user.email,
               "user_id": db_user.user_id,
               "username": db_user.username,
               "otp_purpose": ""
               }
        db.close()
        return res

    db.close()
    # invalid otp, try again i guess
    return {"success": "400", "message": "Invalid OTP.", "route": "/otp"}


@ router.post("/roomcrafter/test/get_valid_otp_entry")
async def get_valid_otp_entry(user: schemas.UserOnlyEmail, db: Session = Depends(get_db)):
    db_user = user_crud.get_user_by_email(db, email=user.email)

    if not db_user:
        db.close()
        return {"success": "400", "message": "User not found.", "route": "/landing?login=true"}
    # user_verify_otp = user_crud.verify_otp(db, db_user.user_id, user)

    otp_entry = user_crud.get_valid_otp_entry(db, db_user.user_id)

    return {"success": "200", "otp_entry": otp_entry}


@ router.post("/user_login")
async def user_login(request: Request, user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = user_crud.get_user_by_email(db, email=user.email)
    logger.info(f"Login attempt on {user.email} account has been detected")
    if not db_user:
        db.close()
        return {"success": "400", "message": "Please check your email or password."}

    db.close()
    return user_crud.user_login(request, db, user)


@ router.post("/forgot_password")
async def forgot_password(request: Request, user: schemas.UserOnlyEmail, db: Session = Depends(get_db)):
    db_user = user_crud.get_user_by_email(db, email=user.email)
    if not db_user:
        db.close()
        return {"success": "400", "message": "Please check your email.", "route": "/landing"}

    otp = generate_otp(db, db_user.user_id)

    # Send email to user email with the otp
    send_email_to_otp(db_user.email, otp)

    db.close()
    return {"success": "200", "message": "OTP Sent.", "route": "/otp", "otp_purpose": "forgot_password"}


@ router.post("/change_password")
async def change_password(request: Request, user: schemas.UserChangePassword, db: Session = Depends(get_db)):
    db_user = user_crud.get_user_by_email(db, email=user.email)
    print(db_user.email)
    if not db_user:
        db.close()
        return {"success": "400", "message": "User not found.", "route": "/landing"}

    user_crud.update_password(db, db_user, user)

    db.close()
    logger.info(
        f"The user with the email {user.email} has successfully changed password")
    return {"success": "200", "message": "Password reset successfully.", "route": "/landing"}


@ router.post("/toggle_2fa")
async def toggle_2fa(request: Request, user: schemas.UserToggle2FA, db: Session = Depends(get_db)):
    db_user = user_crud.get_user_by_email(db, email=user.email)
    if not db_user:
        db.close()
        return {"success": "400", "message": "User not found.", "route": "/landing"}

    user_crud.toggle_2fa(db, db_user, user)
    msg = "Enabled" if user.login_req_2fa else "Disabled"
    db.close()
    return {"success": "200", "message": {msg}, "route": "/profile"}


@ router.post("/update_profile")
async def update_profile(request: Request, user: schemas.UserUpdate, db: Session = Depends(get_db)):
    db_user = user_crud.get_user_by_email(db, email=user.email)
    if not db_user:
        db.close()
        return {"success": "400", "message": "User not found.", "route": "/landing"}

    user_crud.update_profile(db, db_user, user)
    db.close()
    logger.info(
        f"The user with the email {user.email} has successfully updated profile")
    return {"success": "200", "message": "Profile update successfully.", "route": "/profile"}


@router.delete("/users/{user_id}", response_model=schemas.UserRead)
async def delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = user_crud.get_user_by_id(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(db_user)
    logger.info(f"The user with the email: {db_user.email} and ID: {db_user.user_id} has been deleted")
    db.commit()
    return db_user


@router.get("/users", response_model=List[schemas.UserRead])
async def get_users(db: Session = Depends(get_db)):
    users = db.query(models.User).filter(models.User.role=="user").all()
    return users
