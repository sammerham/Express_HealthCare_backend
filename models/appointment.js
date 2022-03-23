"use strict";

const db = require("../db");
const {
  NotFoundError,
  BadRequestError,
} = require("../ExpressError/expressError");
const { sqlForPartialUpdate } = require("../helper/sql");
const Doctor = require("../models/doctor");


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

  /** get all appointments by patient fname / lName.
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
  static async getApptsByName(fName,lName) {
    const results = await db.query(
      `SELECT
      id,
      patient_first_name,
      patient_last_name,
      doctor_id,
      appt_date,
      appt_time,
      kind
      FROM
      appointments
      WHERE
      patient_first_name = $1
      AND
      patient_last_name = $2`,
      [fName, lName],
    );
    return results.rows
  }

    /** get appt by ID.
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

  static async getAppointmentById(id) {
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
    const doctor = await Doctor.showDoctorByName(doctor_First_Name, doctor_Last_Name);
    if(!doctor[0]) throw new NotFoundError(`Dr. ${doctor_First_Name} ${doctor_Last_Name} doesn't exist!`)
    const { id } = doctor[0];
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
      return new BadRequestError(`Doctor ${doctor_Last_Name} has three appts for that time`);
    }
  }
  /** edit appt, return {appt: appt} */
  static async updateAppt(id, data) {
        const { setCols, values } = sqlForPartialUpdate(
        data,
        {
          patientFirstName: "patient_first_name",
          patientLastName: "patient_last_name",
          date: "appt_date",
          time: "appt_time",
          kind:"kind",
          });
    const idVarIdx = "$" + (values.length + 1);
    const querySql = `UPDATE
         appointments
         SET${setCols}
         WHERE
         id = ${idVarIdx}
         RETURNING
         id,
         patient_first_name,
         patient_last_name,
         appt_date,
         appt_time`
    const results = await db.query(querySql, [...values, id]);
    return results.rows[0];
  };



  /** delete appt, return id */
  static async deleteAppt(id) {
    await db.query(
      `DELETE
       FROM
       appointments
       WHERE
       id = $1
      `,
      [id]);
  };

}


module.exports = Appointment;
