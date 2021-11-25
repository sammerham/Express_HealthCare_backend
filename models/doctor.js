"use strict";

const db = require("../db");
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
}
//insert into doctors (first_name, last_name) values ('Lily', 'Merham');
//select * from doctors where first_name = 'Lily' AND last_name='Merham';
//delete from doctors where id=13;
//update doctors set first_name = 'Celina', last_name='Merham' where id=12;

module.exports = Doctor;
