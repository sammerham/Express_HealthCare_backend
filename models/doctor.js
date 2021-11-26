"use strict";

const db = require("../db");
const { NotFoundError, BadRequestError } = require("../expressError");

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
      const results = await db.query(`SELECT * FROM doctors`);
      return results.rows;
  }
  /** get single doctor.
 *
 * Returns {doctor: [{
      "id": 1,
      "first_name": "Oliver",
      "last_name": "Twist"
    }}
 **/

  static async showDoctor(first_name, last_name) {
    const results = await db.query(
      `SELECT *
      FROM
      doctors
      WHERE
      first_name = $1
      AND
      last_name=$2
      `,
      [first_name, last_name]
    );
    return results.rows;
  }
  /** post - add - single doctor.
*
* Returns {doctor: [{
    "id": 1,
    "first_name": "Oliver",
    "last_name": "Twist"
  }}
**/

  
  static async checkDupes(fName,lName) {
    const duplicateCheck = await db.query(
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
    console.log('check', duplicateCheck.rows)
    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }
  }
  
  
  
  static async addDoctor(fName, lName) {
    const results = await db.query(
      `INSERT 
      INTO
      doctors
      (first_name,last_name)
      VALUES
      ($1, $2)
      RETURNING
      id,
      first_name,
      last_name
      `,
      [fName, lName]
    );
    return results.rows;
  }
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
  }
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
  }
}

//update doctors set first_name = 'Celina', last_name='Merham' where id=12;

module.exports = Doctor;
