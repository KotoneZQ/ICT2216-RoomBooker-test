from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, Boolean, VARCHAR, Sequence, Float, PrimaryKeyConstraint, Text, DateTime
from sqlalchemy.orm import relationship, sessionmaker
from .database import Base, engine
from datetime import datetime

# This file will contain the different tables in the database
# Create the class here, and it will appear in your database


class User(Base):
    __tablename__ = "user"

    user_id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(VARCHAR(255), nullable=False, unique=True)
    username = Column(VARCHAR(64), nullable=False, unique=False)
    firstname = Column(VARCHAR(64), nullable=False, unique=False)
    lastname = Column(VARCHAR(64), nullable=False, unique=False)
    phone = Column(VARCHAR(15), nullable=False, unique=False)
    verified = Column(Boolean, nullable=False, default=False)
    login_req_2fa = Column(Boolean, nullable=False, default=False)
    password = Column(VARCHAR(64), nullable=False)
    failed_attempts = Column(Integer, default=0)
    lockout_until = Column(DateTime, nullable=True)
    role = Column(VARCHAR(20), nullable=False, default="user")


class OTP(Base):
    __tablename__ = 'otps'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('user.user_id'))
    otp = Column(VARCHAR(6))
    expires_at = Column(DateTime)


class Reservation(Base):
    __tablename__ = 'reservation'
    reservation_id = Column(Integer, primary_key=True, autoincrement=True)
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    total_price = Column(Float)
    reservation_status = Column(
        VARCHAR(255), default="pending", nullable=False)
    user_id = Column(Integer, ForeignKey('user.user_id'))
    user = relationship("User")


class Room(Base):
    __tablename__ = 'room'
    room_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(VARCHAR(255))
    capacity = Column(VARCHAR(255))
    price = Column(Float)
    room_type_id = Column(Integer, ForeignKey('room_type.room_type_id'))
    description = Column(Text)
    image_url = Column(VARCHAR(255))
    amenities = Column(Text)


class RoomType(Base):
    __tablename__ = 'room_type'
    room_type_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(VARCHAR(255))


class RoomReserved(Base):
    __tablename__ = 'room_reserved'
    room_reserved_id = Column(Integer, primary_key=True, autoincrement=True)
    reservation_id = Column(Integer, ForeignKey('reservation.reservation_id'))
    room_id = Column(Integer, ForeignKey('room.room_id'))
    price = Column(Float)


class Payment(Base):
    __tablename__ = 'payment'
    payment_id = Column(VARCHAR(255), primary_key=True, index=True)
    reservation_id = Column(Integer, ForeignKey('reservation.reservation_id'))
    paid_amount = Column(Float, nullable=False)
    payment_at = Column(DateTime)
    payment_status = Column(VARCHAR(255), default="pending", nullable=False)

# Function to insert initial data


def insert_initial_data(session):
    if not session.query(RoomType).count():
        room_types = [
            RoomType(name="Normal"),
            RoomType(name="Deluxe")
        ]
        session.add_all(room_types)
        session.commit()

    if not session.query(Room).count():
        rooms = [
            Room(name="Deluxe Suite", capacity="2", price=100, room_type_id=2, description="Our Deluxe Suite offers unparalleled luxury with a spacious living area, a king-size bed, and panoramic views of the city skyline.",
                 image_url="https://i.ibb.co/WK4Bmj8/room-1.png", amenities="testing"),
            Room(name="Premium Room", capacity="2", price=50, room_type_id=1, description="Enjoy a comfortable stay in our Premium Room featuring modern amenities, a queen-size bed, and a private balcony.",
                 image_url="https://i.ibb.co/bm29Xf7/room-2.png", amenities="testing"),
            Room(name="Standard Double", capacity="2", price=25, room_type_id=1, description="Our Standard Double Room is perfect for couples, offering a cozy space with a double bed and all the essentials for a comfortable stay.",
                 image_url="https://i.ibb.co/2ZcjP36/room-3.png", amenities="testing")
        ]
        session.add_all(rooms)
        session.commit()


# Create the tables in the database
Base.metadata.create_all(engine)

# Create a new session and insert initial data
Session = sessionmaker(bind=engine)
session = Session()
insert_initial_data(session)
