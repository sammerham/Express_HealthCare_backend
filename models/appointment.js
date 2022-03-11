"use strict";

const db = require("../db");
const {
  NotFoundError,
  BadRequestError,
} = require("../ExpressError/expressError");

class Appointment {
 
  /** get all appointments.
   *
   * Returns {
  "appointments": [
    {
      "id": 5,
      "patient_first_name": "Ceclia",
      "patient_last_name": "Lolback",
      "doctor_id": 2,
      "appt_date": "2022-01-04T08:00:00.000Z",
      "appt_time": "12:45:00",
      "kind": "New Patient"
    }, ...]}
   **/

  static async showAll() {
    const results = await db.query(`
    SELECT
    id,
    patient_first_name,
    patient_last_name,
    doctor_id, 
    appt_date,
    appt_time,
    kind 
    FROM
    appointments
    `);
    return results.rows;
  }


   /** get single doctor by ID.
   *
   * Returns {
  "appointment": 
    {
      "id": 5,
      "patient_first_name": "Ceclia",
      "patient_last_name": "Lolback",
      "doctor_id": 2,
      "appt_date": "2022-01-04T08:00:00.000Z",
      "appt_time": "12:45:00",
      "kind": "New Patient"
    }
   **/

  static async getAppointment(id) {
    const results = await db.query(`
    SELECT
    id,
    patient_first_name,
    patient_last_name,
    doctor_id, 
    appt_date,
    appt_time,
    kind 
    FROM
    appointments
    WHERE id = $1
    `, [id]);
    return results.rows[0];
  }

/** Get a list of all appointments for a particular doctor when provided firstName and lastName
 
 * Returns {
"appointments": [
  {
    "id": 5,
    "patient_first_name": "Ceclia",
    "patient_last_name": "Lolback",
    "doctor_id": 2,
    "appt_date": "2022-01-04T08:00:00.000Z",
    "appt_time": "12:45:00",
    "kind": "New Patient"
  }, ...]}
 **/
  static async showDocAppts(fName, lName) {
    const results = await db.query(
      `SELECT
       appointments.id,
       patient_first_name,
       patient_last_name,
       appt_date,
       appt_time,
       kind,
       first_name as DoctorFName,
       last_name as DoctorLName
       FROM appointments
       JOIN
       doctors
       ON
       doctor_id = doctors.id
       WHERE
       first_name = $1
       AND
       last_name = $2
       `, [fName, lName]
    );
    return results.rows;
  };
  /** Get a list of all appointments for a particular doctor and particular date
  
   * Returns {
  "appointments": [
    {
      "id": 5,
      "patient_first_name": "Ceclia",
      "patient_last_name": "Lolback",
      "doctor_id": 2,
      "appt_date": "2022-01-04T08:00:00.000Z",
      "appt_time": "12:45:00",
      "kind": "New Patient"
    }, ...]}
   **/
  static async showDocApptsDate(fName, lName, date) {
    const results = await db.query(
      `SELECT
       appointments.id,
       patient_first_name,
       patient_last_name,
       appt_date,
       appt_time,
       kind,
       first_name as DoctorFName,
       last_name as DoctorLName
       FROM appointments
       JOIN
       doctors
       ON
       doctor_id = doctors.id
       WHERE
       first_name = $1
       AND
       last_name = $2
       AND
       appt_date = $3
       `, [fName, lName, date]
    );
    return results.rows;
  };
  /** Get a list of all appointments for a particular doctor when ID is provided
 
 * Returns {
"appointments": [
  {
    "id": 5,
    "patient_first_name": "Ceclia",
    "patient_last_name": "Lolback",
    "doctor_id": 2,
    "appt_date": "2022-01-04T08:00:00.000Z",
    "appt_time": "12:45:00",
    "kind": "New Patient"
  }, ...]}
 **/
  static async showDocApptsID(id) {
    const results = await db.query(
      `SELECT
      id,
      patient_first_name,
      patient_last_name,
      appt_date,
      appt_time,
      kind,
      doctor_id
      FROM appointments
      WHERE
      doctor_id = $1
      `, [id]
    );
    return results.rows;
  };
  /** Get a list of all appointments for a particular doctor when ID is provided
 
 * Returns {
"appointments": [
  {
    "id": 5,
    "patient_first_name": "Ceclia",
    "patient_last_name": "Lolback",
    "doctor_id": 2,
    "appt_date": "2022-01-04T08:00:00.000Z",
    "appt_time": "12:45:00",
    "kind": "New Patient"
  }, ...]}
 **/
  static async showDocApptsIdDate(id, date) {
    const results = await db.query(
      `SELECT
       id,
       patient_first_name,
       patient_last_name,
       appt_date,
       appt_time,
       kind,
       doctor_id
       FROM appointments
       WHERE
       doctor_id = $1
       AND
       appt_date=$2
       `, [id, date]
    );
    return results.rows;
  };
  
  /** delete appt, return id */
  static async deleteAppt(id) {
    const results = await db.query(
      `DELETE
       FROM
       appointments
       WHERE
       id = $1
       RETURNING id`,
      [id]);
    return results.rows[0];
  }
  /** Add appt, return {appt: appt} */
  static async addAppt(  
    doctor_First_Name,   
    doctor_Last_Name,
    patient_first_name,
    patient_last_name,
    date,
    time,
    kind
  ) {
    // get doctor id
    const doctor = await db.query(
      `SELECT *
      FROM
      doctors
      WHERE
      first_name = $1
      AND
      last_name=$2
      `,
      [
        doctor_First_Name,
        doctor_Last_Name
      ]
    );
    const { id } = doctor.rows[0];
    if (!id) throw new NotFoundError(`No matching doctor`)
    // check if doctor has more than 3 appts for the same time
    const doc_appts_same_time = await db.query(
      `SELECT *
      FROM
      appointments
      WHERE
      doctor_id=$1
      AND
      appt_time=$2`,
      [id,time]
    );
    const appt_count = doc_appts_same_time.rows.length;


    // Insert into table if if doctor has less than 3 appts for the same time;
    // otherwise return error bad request;

    if (appt_count < 3) {
      const results = await db.query(
        `INSERT INTO
         appointments (
                        patient_first_name,
                        patient_last_name,
                        doctor_id,
                        appt_date,
                        appt_time,
                        kind
                        )
         VALUES
         ($1,$2,$3,$4,$5,$6)
         RETURNING
                id,
                patient_first_name,
                patient_last_name,
                doctor_id,
                appt_date,
                appt_time,
                kind
                `,
        [
          patient_first_name,
          patient_last_name,
          id,
          date,
          time,
          kind,
        ]);
      
      return results.rows[0];
    } else {
      return new BadRequestError(`Doctors already has three appts for that time`);
    }
  }
  /** edit appt, return {appt: appt} */
  static async updateAppt(date, time, id) {
    const results = await db.query(
      `UPDATE
         appointments
         SET
         appt_date = $1,
         appt_time=$2
         WHERE
         id = $3
         RETURNING
         id,
         patient_first_name,
         patient_last_name,
         appt_date,
         appt_time`,
      [date, time, id]);
    return results.rows[0];
  };
}


module.exports = Appointment;
