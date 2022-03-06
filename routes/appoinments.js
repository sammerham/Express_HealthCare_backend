const express = require("express");
const app = require("../app");
const router = express.Router();
const db = require("../db");
const { NotFoundError, BadRequestError } = require("../expressError");
const Appointment = require("../models/appointment")


// routes for appointments
//Get a list of all appointments
//! Good Route - Tested
router.get('/', async (req, res, next) => {
  try {
    const appointments = await Appointment.showAll();
    return res.json({ appointments });
  } catch (e) {
    return next(new NotFoundError('Not Found'));
  }
});

//Get a list of all appointments for a particular doctor
/** GET /[fName]/[lName]- return data about one appt: `{appts: appts}` */
//! Good Route - Tested

router.get("/doctorName/:fName/:lName", async function (req, res, next) {
  try {
  
    const { fName, lName } = req.params;
    const appts = await Appointment.showDocAppts(fName, lName);
    if (!appts) throw new NotFoundError()
    return res.json({ appts });
  } catch (e) {
    return next(new NotFoundError());
  }
});

//Get a list of all appointments for a particular doctor and particular day
/** GET /[fName]/[lName] /[date]- return data about one appt: `{appts: appts}` */
//! Good Route - Tested

router.get("/doctorName/:fName/:lName/:date", async function (req, res, next) {
  try {
    const { fName, lName, date } = req.params;
    const appts = await Appointment.showDocApptsDate(fName, lName, date);
    if (!appts) throw new NotFoundError();
    return res.json({ appts });
  } catch (e) {
    return next(new NotFoundError());
  }
});
//Get a list of all appointments for a particular doctor by ID
/** GET /[id] return data about one appt: `{appts: appts}` */
//! Good Route - Tested

router.get("/doctorId/:id", async function (req, res, next) {
  try {
    const { id } = req.params;
    const appts = await Appointment.showDocApptsID(id);
    if (!appts) throw new NotFoundError();
    return res.json({ appts });
  } catch (e) {
    return next(new NotFoundError());
  }
});
//Get a list of all appointments for a particular doctor by ID and Date
/** GET /[id] return data about one appt: `{appts: appts}` */
//! Good Route - Tested
router.get("/doctorId/:id/:date", async function (req, res, next) {
  try {
    const { id, date } = req.params;
    const appts = await Appointment.showDocApptsIdDate(id, date);
    if (!appts) throw new NotFoundError();
    return res.json({ appts });
  } catch (e) {
    return next(new NotFoundError());
  }
});


/** DELETE /[id] - delete appt, return `{message: "appt deleted"}` */
//! Good Route - Tested

router.delete("/apptId/:id", async function (req, res, next) {
  try {
    const { id } = req.params;
    const appt = await Appointment.deleteAppt(id);
    if (!appt) throw new NotFoundError(`No matching appt: ${id}`);
    return res.json({ message: "Appt deleted" });
  } catch (e) {
    return next(new NotFoundError(`No matching appt: ${id}`));
  }
});

/** POST / - create appt from data; return `{appt: appt}` */
//! Good Route - Tested

router.post("/", async function (req, res, next) {
  console.log(req.body)
  try {
    const appt = await Appointment.addAppt(
      req.body.doctor_First_Name,
      req.body.doctor_Last_Name,
      req.body.patient_first_name,
      req.body.patient_last_name,
      req.body.date,
      req.body.time,
      req.body.kind
    );
    
    return res.status(201).json({ appt });
  } catch (e) {
    return next (new BadRequestError(`Doctors already has three appts for that time`));
  }
});
//! Good Route - Tested

/** PATCH /[id] - update fields in appt; return `{appt: appt}` */

router.patch("/apptId/:id", async function (req, res, next) {
  console.log('inside patch')
  let appt;
  console.log('body', req.body)
  const { date, time } = req.body;
  const { id } = req.params;
  console.log('id -->', id, 'date--->>', date, 'Time___>>', time)
  try {
    appt = await Appointment.updateAppt(date, time, id);
    console.log('appt in pacth', appt)
    if (!appt) throw new NotFoundError(`No matching appt: ${id}`)
    return res.json({ appt });
  } catch (e) {
    return next (new NotFoundError(`No matching appt: ${id}`));
  };
});

module.exports = router;
