import re
from playwright.sync_api import Playwright, sync_playwright, expect, Page
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
URL_DELETE_PAYMENT = "/api/delete-payment-intent"


def test_create_and_verify(capsys, client: TestClient):
    # json_data = {"email": test_userdata["email"]}
    # response = client.post(
    #     URL_DELETE_USER, json=json_data).json()

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


def test_booking_process(page: Page) -> None:
    page.goto("http://localhost:3000/")
    expect(page.get_by_role("button", name="Sign in")).to_be_visible()
    page.get_by_role("button", name="Sign in").click()
    expect(page.get_by_role("button", name="Sign In",
           exact=True)).to_be_visible(timeout=20000)
    page.get_by_label("Email *").click()
    page.get_by_label("Email *").fill("testuser@gmail.com")
    page.get_by_label("Password *").click()
    page.get_by_label("Password *").fill("Testing123@!")
    page.get_by_role("button", name="Sign In", exact=True).click()
    expect(page.get_by_role("button", name="testuser")).to_be_visible()
    expect(page.get_by_role("link", name="ROOMS & SUITES")).to_be_visible()
    page.get_by_role("link", name="ROOMS & SUITES").click()
    expect(page.get_by_role("link", name="Standard Double")).to_be_visible()
    page.get_by_role("link", name="Standard Double").click()
    expect(page.get_by_role("button", name="Book")).to_be_visible()
    page.get_by_role("button", name="Book").click()
    expect(page.get_by_role("button", name="Submit")).to_be_visible()
    page.get_by_label("", exact=True).click()
    page.get_by_role("option", name="1 Room").click()
    page.get_by_label("Check-In Date *").fill("2024-10-04")
    page.get_by_label("Check-Out Date *").fill("2024-10-05")
    page.get_by_role("button", name="Submit").click()
    expect(page.get_by_text("Booking DetailsThe Roombooker")).to_be_visible()
    expect(page.get_by_label("Card Holder Name *")
           ).to_be_visible(timeout=10000)
    page.get_by_label("Card Holder Name *").click()
    page.get_by_label("Card Holder Name *").fill("RoomCrafter")

    # Ensure the iframe is loaded and interact with elements within it using XPath to match the iframe name pattern
    stripe_iframe = page.frame_locator(
        "xpath=//iframe[starts-with(@name, '__privateStripeFrame')]")

    # Add some wait to ensure iframe is fully loaded
    stripe_iframe.locator("input[name='cardnumber']").wait_for(state="visible")

    # Fill in the card details within the iframe
    stripe_iframe.get_by_placeholder("Card number").fill("4242 4242 4242 4242")
    stripe_iframe.get_by_placeholder("MM / YY").fill("10 / 28")
    stripe_iframe.get_by_placeholder("CVC").fill("987")

    # Click the Pay Now button
    expect(page.get_by_role("button", name="Pay Now")).to_be_visible()
    page.get_by_role("button", name="Pay Now").click()
    expect(page.get_by_text("Success", exact=True)
           ).to_be_visible(timeout=10000)


def test_delete_user(client: TestClient):

    # Delete payment and reservation
    # Check if the user already exists
    # user = client.get(
    #     URL_GET_USER_BY_EMAIL).json()

    # json_data = {"user_id": user['user_id']}
    # print("Json data is : ", type(json_data['user_id']))
    # response = client.post(URL_DELETE_PAYMENT, json=json_data).json()
    # print("Response data is : ", response)
    # assert response['success'] == "200"
    # assert response['message'] == "delete payment success"

    # Delete user
    json_data = {"email": test_userdata["email"]}
    response = client.post(
        URL_DELETE_USER, json=json_data).json()
    assert response['success'] == "200"
    assert response['message'] == "{email} account deleted.".format(
        email=test_userdata["email"])
