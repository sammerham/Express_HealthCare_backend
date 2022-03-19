DROP TABLE IF EXISTS doctors;

-- doctors table
CREATE TABLE doctors 
(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email TEXT NOT NULL
    CHECK (position('@' IN email) > 1) UNIQUE
);

-- appointments table
DROP TABLE IF EXISTS appointments;
CREATE TABLE appointments 
(
    id SERIAL PRIMARY KEY,
    patient_first_name VARCHAR(50) NOT NULL,
    patient_last_name VARCHAR(50) NOT NULL,
    doctor_id INTEGER REFERENCES doctors ON DELETE CASCADE, 
    appt_date DATE NOT NULL,
    appt_time TIME NOT NULL CHECK (extract(minutes from appt_time) IN (0, 15, 30, 45 )),
    kind TEXT NOT NULL  CHECK (kind IN ('New Patient', 'Follow-up'))
);

-- users table
DROP TABLE IF EXISTS users;
CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1) UNIQUE,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);
