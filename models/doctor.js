"use strict";

const db = require("../db");
const { BadRequestError } = require("../ExpressError/expressError");

class Doctor {
  /** get all doctors.
   *
   * Returns {doctors: [{
        "id": 1,
        "first_name": "Oliver",
        "last_name": "Twist"
      }, ...]}
   **/
 
  static async showAll() {
    const results = await db.query(`
      SELECT
      id, first_name, last_name
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
      "last_name": "Twist"
    }}
 **/

  static async showDoctorByName(first_name, last_name) {
    const results = await db.query(
      `SELECT 
      id, first_name, last_name
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
      "last_name": "Twist"
    }}
 **/

  static async showDoctorById(id) {
    const results = await db.query(
      `SELECT 
      id, first_name, last_name
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
  "last_name": "Twist"
}}
**/
  
  static async addDoctor(fName, lName, email) {
    try {
      const results = await db.query(
        `INSERT 
        INTO
        doctors
        (first_name,last_name)
        VALUES
        ($1, $2, $3)
        RETURNING
        id,
        first_name,
        last_name
        `,
        [fName, lName, email]
      );
      return results.rows;
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
  
  static async updateDoctor(fName, lName, id) {
    const results = await db.query(
      `UPDATE
         doctors
         SET
         first_name = $1,
         last_name=$2
         WHERE
         id = $3
         RETURNING
         id,
         first_name,
         last_name`,
      [fName, lName, id]);
    return results.rows[0];
  };
};


module.exports = Doctor;
