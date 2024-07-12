from typing import Union, List, Optional
from pydantic import BaseModel, EmailStr, Field, field_validator, AnyUrl
from datetime import datetime
from typing_extensions import Annotated
from pydantic.functional_validators import BeforeValidator
import re

# This file will dictate and enforce what kind of data should pass through FastAPI, not too much, not too less

PyObjectId = Annotated[str, BeforeValidator(str)]

# User Table

class UserRead(BaseModel):
    user_id: int
    username: str
    email: EmailStr
    password: str
    verified: bool
    login_req_2fa: bool
    firstname: str
    lastname: str
    phone: str
    role: str

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserVerify(BaseModel):
    email: EmailStr
    otp: str
    otp_purpose: str

class UserVerifyAcc(BaseModel):
    email: EmailStr
    get_verify_link: str

class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=30)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)
    firstname: str = Field(..., min_length=1, max_length=50)
    lastname: str = Field(..., min_length=1, max_length=50)
    phone: str = Field(..., min_length=8, max_length=8)
    role: Optional[str] = "user"

    @field_validator('username', 'firstname', 'lastname')
    def no_special_characters(cls, v):
        if not all(c.isalnum() or c.isspace() for c in v):
            raise ValueError('must be alphanumeric and can only contain spaces')
        return v

    @field_validator('phone')
    def validate_phone(cls, v):
        if not v.isdigit():
            raise ValueError('Phone number must contain only digits.')
        return v

    @field_validator('password')
    def password_complexity(cls, value):
        if not re.search(r'\d', value):
            raise ValueError('Password must contain at least one number.')
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', value):
            raise ValueError('Password must contain at least one special character.')
        if not re.search(r'[A-Z]', value):
            raise ValueError('Password must contain at least one uppercase letter.')
        return value
    
class UserDelete(BaseModel):
    email: str

class UserOnlyEmail(BaseModel):
    email: EmailStr

class UserSendOTP(BaseModel):
    email: EmailStr
    cur_route: str

class UserChangePassword(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=12, max_length=128)

    @field_validator('password')
    def password_complexity(cls, value):
        if not re.search(r'\d', value):
            raise ValueError('Password must contain at least one number.')
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', value):
            raise ValueError('Password must contain at least one special character.')
        return value

class UserToggle2FA(BaseModel):
    email: EmailStr
    login_req_2fa: bool

class UserUpdate(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=30)
    firstname: str = Field(..., min_length=1, max_length=50)
    lastname: str = Field(..., min_length=1, max_length=50)
    phone: str = Field(..., min_length=8, max_length=8)

    @field_validator('username', 'firstname', 'lastname')
    def no_special_characters(cls, v):
        if not v.isalnum():
            raise ValueError('Must be alphanumeric')
        return v

    @field_validator('phone')
    def validate_phone(cls, v):
        if not v.isdigit():
            raise ValueError('Phone number must contain only digits.')
        return v
    
class UserValidOTP(BaseModel):
    email: str



# Reservation Table
class Room(BaseModel):
    name: str

    class Config:
        from_attributes = True

class ReservationBase(BaseModel):
    start_date: datetime
    end_date: datetime
    total_price: float = Field(..., gt=0)
    user_id: int

class ReservationCreate(ReservationBase):
    pass

class Reservation(ReservationBase):
    reservation_id: int
    room:Room

    class Config:
        from_attributes = True

# Payment Table

class PaymentBase(BaseModel):
    paid_amount: float = Field(..., gt=0)

class PaymentCreate(PaymentBase):
    room_id: int
    room_count: int
    check_in_date: datetime
    check_out_date: datetime
    paid_amount: float
    user_id: int

class PaymentUpdateStatus(BaseModel):
    payment_id: str
    payment_status: str
    reservation_id: int
    total_price: float = Field(..., gt=0)
    room_id: int

class Payment(PaymentBase):
    payment_id: str
    payment_at: datetime
    payment_status: str

    class Config:
        from_attributes = True

# Room Table

class RoomBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    capacity: int = Field(..., gt=0)
    price: float = Field(..., gt=0)
    room_type_id: int
    description: Optional[str] = Field(None, max_length=500)
    image_url: Optional[AnyUrl] = None
    amenities: Optional[str] = Field(None, max_length=500)

class RoomPrice(BaseModel):
    price: float = Field(..., gt=0)

class RoomCreate(RoomBase):
    pass

class Room(RoomBase):
    room_id: int

    class Config:
        from_attributes = True

# Room Type Table

class RoomTypeBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)

class RoomTypeCreate(RoomTypeBase):
    pass

class RoomType(RoomTypeBase):
    room_type_id: int

    class Config:
        from_attributes = True

# Room Reserved Table

class RoomReservedBase(BaseModel):
    reservation_id: int
    room_id: int
    price: float = Field(..., gt=0)

class RoomReservedCreate(RoomReservedBase):
    pass

class RoomReserved(RoomReservedBase):
    room_reserved_id: int

    class Config:
        from_attributes = True