"use strict";

const db = require("../db");
const { BadRequestError } = require("../ExpressError/expressError");

class Doctor {
  /** get all doctors.
   *
   * Returns {doctors: [{
        "id": 1,
        "last_name": "Twist",
        "email": "oliver@sodlcshealth.com"
      }, ...]}
   **/
 
  static async showAll() {
    const results = await db.query(`
      SELECT
      id, first_name, last_name, email
      FROM
      doctors
      `);
      return results.rows;
  }
  /** get single doctor by fName and lName.
 *
 * Returns {doctor: [{
      "id": 1,
      "first_name": "Oliver",
      "last_name": "Twist",
      "email": "oliver@sodlcshealth.com"
    }}
 **/

  static async showDoctorByName(first_name, last_name) {
    const results = await db.query(
      `SELECT 
      id, first_name, last_name, email
      FROM
      doctors
      WHERE
      first_name = $1
      AND
      last_name=$2
      `,
      [first_name, last_name]
    );
    return results.rows[0];
  }
   /** get single doctor by ID.
 *
 * Returns {doctor: [{
      "id": 1,
      "first_name": "Oliver",
      "last_name": "Twist",
      "email": "oliver@sodlcshealth.com"
    }}
 **/

  static async showDoctorById(id) {
    const results = await db.query(
      `SELECT 
      id, first_name, last_name, email
      FROM
      doctors
      WHERE
      id = $1
      `,
      [id]
    );
    return results.rows[0];
  }

  /**  checks if there is any duplicates.
**/
  
  static async checkDupes(fName,lName) {
    const results = await db.query(
      `SELECT
      first_name,
      last_name
      FROM
      doctors
      WHERE
      first_name = $1
      AND
      last_name = $2`,
      [fName, lName],
    );
    return results.rows[0]
  }
  
  
  /**  add a single doctor.
*
* Returns {doctor: [{
  "id": 1,
  "first_name": "Oliver",
  "last_name": "Twist",
  "email": "oliver@sodlcshealth.com"
}}
**/
  
  static async addDoctor(fName, lName, email) {
    try {
      const results = await db.query(
        `INSERT 
        INTO
        doctors
        (first_name,last_name, email)
        VALUES
        ($1, $2, $3)
        RETURNING
        id,
        first_name,
        last_name,
        email
        `,
        [fName, lName, email]
      );
      return results.rows[0];
    } catch (e) {
      // check for dupes
      if (e.code = '23505') { // using code errors from pg to check for duplicate  since it has unique constrains
        // better than running a query as above to check for duplication.
        throw new BadRequestError(`Duplicate email: ${email} already exists`);
    }
  }

  };

  /** delete doctor, return id */

  static async deleteDoctor(id) {
    const results = await db.query(
      `DELETE
       FROM
       doctors
       WHERE
       id = $1
       RETURNING id`,
      [id]);
    return results.rows[0];
  };

  /** edit doctor, return {doctor: doctor} */
  
  static async updateDoctor(fName, lName,email, id) {
    const results = await db.query(
      `UPDATE
         doctors
         SET
         first_name = $1,
         last_name=$2,
         email = $3
         WHERE
         id = $4
         RETURNING
         id,
         first_name,
         last_name,
         email`,
      [fName, lName, email, id]);
    return results.rows[0];
  };



//************************************** DOCTOR APPTS */
   
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
  static async showDocApptsByName(fName, lName) {
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
  static async showDocApptsByDate(fName, lName, date) {
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
  static async showDocApptsById(id) {
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
  static async showDocApptsByIdDate(id, date) {
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

//************************************** DOCTOR APPTS */
};


module.exports = Doctor;
