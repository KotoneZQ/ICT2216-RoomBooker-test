import bcrypt
# This file contains the function for password for user


# Function to hash a password


def hash_password(password: str) -> str:
    # Generate a salt with a work factor of 12 (default)
    salt = bcrypt.gensalt()
    # Hash the password
    hashed_password = bcrypt.hashpw(password.encode(), salt)
    return hashed_password.decode()

# Function to verify a password


def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Check if the provided password matches the hashed password
    return bcrypt.checkpw(plain_password.encode(), hashed_password.encode())

def check_password_complexity(password: str) -> bool:
    if len(password) < 12 or len(password) > 64:
        return False
    has_digit = False
    has_special = False
    has_uppercase = False
    for char in password:
        if char.isdigit():
            has_digit = True
        elif not char.isalnum():
            has_special = True
        elif char.isupper():
            has_uppercase = True
    return has_digit and has_special and has_uppercase