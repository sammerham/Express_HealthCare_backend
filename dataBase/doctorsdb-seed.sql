-- const bcrypt = require("bcrypt");

INSERT INTO doctors
(
    first_name, 
    last_name, 
    email
    )
VALUES
('Oliver', 'Twist', 'oliver@sodlcshealth.com'),
('Randy', 'Hillman','randy@sodlcshealth.com'),
('Greg', 'Hilton', 'greg@sodlcshealth.com'),
('Tom', 'Landman', 'tom@sodlcshealth.com');



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



INSERT INTO users
(
    username,
    password,
    first_name,
    last_name,
    email,
    is_admin
    )
VALUES
('samehisaac',
'$2b$12$4njsmPHX31ksBKi5iuMWiOcStpEcO/ztMBIe4NjLkAAQ9dKJbMGty',
'Sam',
'Merham',
'sam@smerham.com',
't')

-- samehisaacp
