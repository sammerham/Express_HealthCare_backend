DROP DATABASE IF EXISTS doctorsdb;

CREATE DATABASE doctorsdb;

\c doctorsdb;

DROP TABLE IF EXISTS doctors;

CREATE TABLE doctors 
(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL
);

INSERT INTO doctors
(first_name, last_name)
VALUES
('Oliver', 'Twist'),
('Randy', 'Hillman'),
('Greg', 'Hilton'),
('Tom', 'Landman');

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

INSERT INTO appointments
(
    patient_first_name,
    patient_last_name,
    doctor_id,
    appt_date,
    appt_time,
    kind
    )
VALUES
('Jones', 'Art', 1, '2022-03-04', '10:00 AM', 'Follow-up'),
('Sam', 'Samuel', 1, '2021-12-04', '03:00 PM', 'New Patient'),
('Mike', 'Harry', 3, '2021-11-29', '01:15 PM', 'Follow-up'),
('Toomy', 'Lee', 1, '2021-11-29', '08:30 AM', 'New Patient'),
('Ceclia', 'Lolback', 2, '2022-01-04', '12:45 PM', 'New Patient');
