from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.middleware import SlowAPIMiddleware
from pydantic import BaseModel
import uvicorn
from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from sqlalchemy.orm import Session
from api import router as apiroute
from sql_app import user_crud
from sql_app import models, schemas
from sql_app.database import SessionLocal, engine
from payment_router import router as payment_router
import room
import logging

models.Base.metadata.create_all(bind=engine)

app = FastAPI()
logging.basicConfig(level=logging.DEBUG)

# Initialize the Limiter
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(HTTPException, _rate_limit_exceeded_handler)

# Add middleware
app.add_middleware(SlowAPIMiddleware)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add session middleware
app.add_middleware(
    SessionMiddleware,
    secret_key="secret",
    max_age=3600  # 1 hour
)

# Include the API router
app.include_router(apiroute)
app.include_router(payment_router, prefix="/api")
app.include_router(room.router)

class LoginModel(BaseModel):
    username: str
    password: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def verify_session(request: Request):
    email = request.session.get("email")
    if email is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return email

@app.get("/")
@limiter.limit("5/minute")
async def read_root(request: Request):
    return {"message": "Hello, World!"}

# User Routes
@app.post("/api/login")
@limiter.limit("10/minute")
async def login(request: Request, login_model: LoginModel, db: Session = Depends(get_db)):
    username = login_model.username
    password = login_model.password
    db_user = user_crud.get_user_by_email(db, username)
    if db_user and username == db_user.username and password == db_user.password:
        request.session['username'] = username
        return db_user
    else:
        raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/api/logout")
async def logout(request: Request):
    request.session.pop("username", None)
    return {"message": "Logged out"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="debug")