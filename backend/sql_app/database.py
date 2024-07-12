from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import pymongo
import motor.motor_asyncio
from typing_extensions import Annotated
from pydantic.functional_validators import BeforeValidator
import urllib.parse
import os
from dotenv import load_dotenv

load_dotenv()  # take environment variables

user = os.environ['DB_USERNAME']
password = os.environ['DB_PASSWORD']
host = os.environ['DB_HOST']
port = os.environ['DB_PORT']
database = os.environ['DB_NAME']

password = urllib.parse.quote_plus(password)

SQL_ALCHEMY_DATABASE_URL = "mysql+pymysql://{0}:{1}@{2}:{3}/{4}".format(
    user, password, host, port, database
)

engine = create_engine(SQL_ALCHEMY_DATABASE_URL,
                       # the following line prob not needed if connect locally but since its working, i lazy test
                       pool_size=20,
                       max_overflow=0,
                       pool_pre_ping=True
                       )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
