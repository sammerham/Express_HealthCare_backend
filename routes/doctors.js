'use strict'
const express = require("express");
const router = express.Router();
const db = require("../db");
const { NotFoundError } = require("../expressError");
const Doctor = require("../models/doctor");


// routes for doctors
/** GET / - returns `{doctors: [{
      "id": 1,
      "first_name": "Oliver",
      "last_name": "Twist"
    }, ...]}` */

router.get('/', async (req, res, next) => {
  try {
    const doctors = await Doctor.showAll();
    console.log('doctors', doctors);
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
    if (!doctor) throw new NotFoundError()
    return res.json({ doctor });
  } catch (e) {
    return next(new NotFoundError());
  }
});


module.exports = router;



