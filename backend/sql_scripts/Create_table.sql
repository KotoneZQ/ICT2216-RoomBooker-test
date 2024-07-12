-- Drop existing tables if they exist
DROP TABLE IF EXISTS room_reserved;
DROP TABLE IF EXISTS reservation;
DROP TABLE IF EXISTS payment;
DROP TABLE IF EXISTS room;
DROP TABLE IF EXISTS room_type;
DROP TABLE IF EXISTS otps;
DROP TABLE IF EXISTS user;

-- Create user table with new columns for role, failed_attempts, and lockout_until
CREATE TABLE IF NOT EXISTS user (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(64) NOT NULL,
    firstname VARCHAR(64) NOT NULL,
    lastname VARCHAR(64) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    login_req_2fa BOOLEAN NOT NULL DEFAULT FALSE,
    password VARCHAR(64) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    failed_attempts INT NOT NULL DEFAULT 0,
    lockout_until DATETIME
);

-- Create otps table
CREATE TABLE IF NOT EXISTS otps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    otp VARCHAR(6),
    expires_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES user(user_id)
);

-- Create room_type table
CREATE TABLE IF NOT EXISTS room_type (
    room_type_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Create room table
CREATE TABLE IF NOT EXISTS room (
    room_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    capacity VARCHAR(255),
    price FLOAT,
    room_type_id INT,
    description TEXT,
    image_url VARCHAR(255),
    amenities TEXT,
    FOREIGN KEY (room_type_id) REFERENCES room_type(room_type_id)
);

-- Create reservation table
CREATE TABLE IF NOT EXISTS reservation (
    reservation_id INT AUTO_INCREMENT PRIMARY KEY,
    start_date DATETIME,
    end_date DATETIME,
    total_price FLOAT,
    reservation_status VARCHAR(255) DEFAULT 'pending' NOT NULL,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES user(user_id)
);

-- Create room_reserved table
CREATE TABLE IF NOT EXISTS room_reserved (
    room_reserved_id INT AUTO_INCREMENT PRIMARY KEY,
    reservation_id INT,
    room_id INT,
    price FLOAT,
    FOREIGN KEY (reservation_id) REFERENCES reservation(reservation_id),
    FOREIGN KEY (room_id) REFERENCES room(room_id)
);

-- Create payment table
CREATE TABLE IF NOT EXISTS payment (
    payment_id VARCHAR(255) PRIMARY KEY,
    reservation_id INT,
    paid_amount FLOAT NOT NULL,
    payment_at DATETIME,
    payment_status VARCHAR(255) DEFAULT 'pending',
    FOREIGN KEY (reservation_id) REFERENCES reservation(reservation_id)
);


INSERT INTO roombooker.room_type (name) VALUES ("Normal");
INSERT INTO roombooker.room_type (name) VALUES ("Deluxe");

INSERT INTO roombooker.room (name, capacity, price, room_type_id, description, image_url, amenities) VALUES ("Deluxe Suite", 2, 100, 2, "Our Deluxe Suite offers unparalleled luxury with a spacious living area, a king-size bed, and panoramic views of the city skyline.", "https://i.ibb.co/WK4Bmj8/room-1.png", "testing");
INSERT INTO roombooker.room (name, capacity, price, room_type_id, description, image_url, amenities) VALUES ("Premium Room", 2, 50, 1, "Enjoy a comfortable stay in our Premium Room featuring modern amenities, a queen-size bed, and a private balcony.", "https://i.ibb.co/bm29Xf7/room-2.png", "testing");
INSERT INTO roombooker.room (name, capacity, price, room_type_id, description, image_url, amenities) VALUES ("Standard Double", 2, 25, 1, "Our Standard Double Room is perfect for couples, offering a cozy space with a double bed and all the essentials for a comfortable stay.", "https://i.ibb.co/2ZcjP36/room-3.png", "testing");