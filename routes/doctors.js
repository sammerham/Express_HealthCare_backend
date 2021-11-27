'use strict'
const express = require("express");
const router = express.Router();
const app = require("../app");

const db = require("../db");
const { NotFoundError, BadRequestError } = require("../expressError");
const Doctor = require("../models/doctor");


// routes for doctors
/** GET / - returns `{doctors: [{
      "id": 1,
      "first_name": "Oliver",
      "last_name": "Twist"
    }, ...]}` */

router.get('/', async (req, res, next) => {
  // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
  try {
    const doctors = await Doctor.showAll();
    return res.json({ doctors });
  } catch (e) {
    return next(new NotFoundError('NOt Found'));
  }
});

/** GET /[fName]/[lName] - returns `{doctor: {
      "id": 1,
      "first_name": "Oliver",
      "last_name": "Twist"
    }}` */


router.get("/:fName/:lName", async function (req, res, next) {
  try {
    const fName = req.params.fName;
    const lName = req.params.lName;
    const doctor = await Doctor.showDoctor(fName, lName);
    if (!doctor) throw new NotFoundError();
    return res.json({ doctor });
  } catch (e) {
     return next(new NotFoundError());
  }
});

/** POST  - returns `{doctor: {
      "id": 1,
      "first_name": "Oliver",
      "last_name": "Twist"
    }}` */


router.post("/", async function (req, res, next) {
  try {
    const fName = req.body.fName;
    const lName = req.body.lName;
    console.log('body', fName, lName);
    // if fName or lName fields is empty return bad request
    if (!fName|| !lName) return next(new BadRequestError('empty name'));
    // check for duplicates
    const dupes = await Doctor.checkDupes(fName, lName);
    const doctor = await Doctor.addDoctor(fName, lName);
    return res.json({ doctor });
  } catch (e) {
    return next(new BadRequestError('doctor already exist'));
  }
});
/** DELETE /[id] - delete doctor, return `{message: "doctor deleted"}` */

router.delete("/:id", async function (req, res, next) {
  let id;
  try {
    id = req.params.id;
    const doctor = await Doctor.deleteDoctor(id);
    if (!doctor) throw new NotFoundError(`No matching appt: ${id}`);
    return res.json({ message: "doctor deleted" });
  } catch (e) {
    return next(new NotFoundError(`No matching doctor: ${id}`));
  }
});

/** PATCH /[id] - update fields in doctor; return `{doctor: doctor}` */

router.patch("/:id", async function (req, res, next) {
  let doctor;
  const { fName, lName } = req.body;
  const id = req.params.id;
  try {
    doctor = await Doctor.updateDoctor(fName, lName, id);
    if (!doctor) throw new NotFoundError(`No matching doctor: ${id}`);
    return res.json({ doctor });
  } catch (e) {
    return next(new NotFoundError(`No matching doctor: ${id}`));
  };
});

module.exports = router;



