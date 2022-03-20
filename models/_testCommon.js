const bcrypt = require("bcrypt");
const db = require("../db");
const { BCRYPT_WORK_FACTOR } = require("../config");



async function commonBeforeAll() {

  // clearning doctors table
  await db.query("DELETE FROM doctors");
  // clearning appts table
  await db.query("DELETE FROM appointments");
  // clearning users table
  await db.query("DELETE FROM users");

  // seeding doctors tables
  const resultsDoctors = await db.query(`
    INSERT INTO doctors ( first_name, last_name, email )
    VALUES  ('d1', 'test1', 'd1@test.com'),
            ('d2', 'test2', 'd2@test.com'),
            ('d3', 'test3', 'd3@test.com')
    RETURNING id`);
  
  
  // getting doc ids to be used in appts inserting query
  const docIds = resultsDoctors.rows.map(d => d.id);

// seeding users table
  await db.query(`
        INSERT INTO users(username,
                          password,
                          first_name,
                          last_name,
                          email)
        VALUES ('u1', $1, 'U1F', 'U1L', 'u1@email.com'),
               ('u2', $2, 'U2F', 'U2L', 'u2@email.com')
        RETURNING username`,
      [
        await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
        await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
      ]);

  // seeding appts table
  await db.query(`
        INSERT INTO appointments (
          patient_first_name,
          patient_last_name,
          doctor_id,
          appt_date,
          appt_time,
          kind
        )
      VALUES
      ('ptest1', 'test1', $1, '2022-03-04', '10:00 AM', 'Follow-up'),
      ('ptest2', 'test2', $2, '2021-12-04', '03:00 PM', 'New Patient'),
      ('ptest3', 'test3', $3, '2021-11-29', '01:15 PM', 'Follow-up')`,
    [docIds[0], docIds[1], docIds[2]]
  );
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
};