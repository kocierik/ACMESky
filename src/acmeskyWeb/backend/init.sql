CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE user_interests (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    departure_location VARCHAR(100) NOT NULL,
    arrival_location VARCHAR(100) NOT NULL,
    departure_date DATE NOT NULL,
    arrival_date DATE NOT NULL,
    max_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO users (email, password) VALUES
('user1@example.com', 'password1'),
('user2@example.com', 'password2'),
('user3@example.com', 'password3'),
('erik@gmail.com', 'erik@gmail.com');


INSERT INTO user_interests (user_id, departure_location, arrival_location, departure_date, arrival_date, max_price)
VALUES 
(1, 'Roma', 'Parigi', '2024-03-20', '2024-03-25', 500.00),
(2, 'Milano', 'Londra', '2024-04-10', '2024-04-15', 600.00),
(3, 'New York', 'Tokyo', '2024-05-01', '2024-05-10', 1000.00),
(4, 'New York', 'Tokyo', '2024-05-01', '2024-05-10', 1000.00);


