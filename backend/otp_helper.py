from sqlalchemy.orm import Session
from sql_app.models import OTP
# from datetime import datetime, timedelta
import datetime
import pyotp

# This file will supposedly generate OTP for user


def generate_otp(db: Session, user_id: int):

    secret = pyotp.random_base32()
    totp = pyotp.TOTP(secret, interval=(60)*5)
    otp = totp.now()

    expires_at = datetime.datetime.now() + \
        datetime.timedelta(minutes=5)  # OTP valid for 5 minute

    otp_entry = OTP(user_id=user_id, otp=otp, expires_at=expires_at)
    db.add(otp_entry)
    db.commit()
    return otp
