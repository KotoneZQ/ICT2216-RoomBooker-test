import pytest
from fastapi.testclient import TestClient
from sql_app import schemas
from sql_app.database import Base, get_db
from main import app
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import re

load_dotenv()  # take environment variables

SQLALCHEMY_DATABASE_URL = "sqlite://"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={
                       "check_same_thread": False})
TestingSessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="module")
def test_db():
    Base.metadata.create_all(bind=engine)  # Create the tables
    yield TestingSessionLocal()  # Provide the session to the tests
    Base.metadata.drop_all(bind=engine)  # Drop the tables after tests


@pytest.fixture(scope="module")
def client(test_db):
    def override_get_db():
        try:
            db = test_db
            yield db
        finally:
            db.close()
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c


test_userdata = {
    "username": "testuser",
    "email": "testuser@gmail.com",
    "password": "Testing123@!",
    "firstname": "testfirstname",
    "lastname": "testlastname",
    "phone": "55555555"
}

user_data = schemas.UserCreate(email=test_userdata["email"],
                               username=test_userdata["username"],
                               password=test_userdata["password"],
                               firstname=test_userdata["firstname"],
                               lastname=test_userdata["lastname"],
                               phone=test_userdata["phone"])
user_id = -1

# URLs for API calls to api.py
URL_GET_USER_BY_EMAIL = "/api/user/email/{email}".format(
    email=test_userdata["email"])
URL_GET_USER_BY_ID = "/api/user/{uid}"
URL_CREATE_USER = "/api/user"
URL_DELETE_USER = "/api/delete_user"
URL_GET_VALID_OTP = "/api/roomcrafter/test/get_valid_otp_entry"
URL_VERIFY_LINK = "/api/verify_link"
# Working


def test_create_user(client: TestClient):
    # Check if the user already exists
    response = client.get(
        URL_GET_USER_BY_EMAIL).json()
    if response['user_id'] != -1:
        assert response['user_id'] != -1
    else:
        assert response['user_id'] == -1

    # Create user
    response = client.post(URL_CREATE_USER, json=test_userdata).json()
    assert response['email'][0] == test_userdata['email']
    assert response['success'] == "200"

    # Delete user
    json_data = {"email": test_userdata["email"]}
    response = client.post(
        URL_DELETE_USER, json=json_data).json()
    print("Delete user response: ", response)
    assert response['success'] == "200"
    assert response['message'] == "{email} account deleted.".format(
        email=test_userdata["email"])


# WORKING
def test_get_user_by_id(client: TestClient):
    # Create user
    response = client.post(URL_CREATE_USER, json=test_userdata).json()
    assert response['email'][0] == test_userdata['email']
    assert response['success'] == "200"

    # Get user_id using email
    response = client.get(URL_GET_USER_BY_EMAIL).json()
    user_id = response['user_id']

    # Get user using user_id
    response = client.get(URL_GET_USER_BY_ID.format(uid=user_id)).json()
    assert response["user_id"] == user_id

    # Delete user
    json_data = {"email": test_userdata["email"]}
    response = client.post(
        URL_DELETE_USER, json=json_data).json()
    assert response['success'] == "200"
    assert response['message'] == "{email} account deleted.".format(
        email=test_userdata["email"])


def test_verify_link(capsys, client: TestClient):
    # Create a test user
    response = client.post(URL_CREATE_USER, json=test_userdata)
    assert response.status_code == 200
    response_data = response.json()
    assert response_data["success"] == "200"

    # Get the hashed_link that was sent to user's email from print statement in api.py
    captured = (capsys.readouterr().out).split('\n')
    extracted_url = ""
    vlinkPart = ""
    for line in captured:
        if line[0:3] == "URL":
            extracted_url = line.split(' ')[-1]
            email_pattern = r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+(/.+$)"
            match = re.search(email_pattern, extracted_url)
            if match:
                # Extract the hashed part after the email
                vlinkPart = match.group(1)[1::]

    # Verify User account
    json_data = {"email": test_userdata["email"],
                 "get_verify_link": vlinkPart}
    response = client.post(URL_VERIFY_LINK, json=json_data).json()
    assert response["success"] == "200"
    assert response["message"] == "OTP verified and account created successfully."

    # Delete user
    json_data = {"email": test_userdata["email"]}
    response = client.post(
        URL_DELETE_USER, json=json_data).json()
    assert response['success'] == "200"
    assert response['message'] == "{email} account deleted.".format(
        email=test_userdata["email"])
