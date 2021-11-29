
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());

// useful error class to throw
const { NotFoundError } = require("./expressError");

// process JSON body => req.body
app.use(express.json());

// process traditional form data => req.body
app.use(express.urlencoded({ extended: true }));



//!*************IMPORTING ROUTES*****************
//importing doctors routes
const dRoutes = require('./routes/doctors');
const apptRoutes = require('./routes/appoinments');
//!******************************

//!*************Middleware for CORS Access-Control-Allow-Origin header *****************

// app.use(function (req, res, next) {
//   // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001')
//   res.setHeader('Access-Control-Allow-Origin', "*")
//   res.setHeader("Access-Control-Allow-Methods", "*");
//   next();
// });
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
//!*************Creating ROUTES*****************
app.use('/doctors', dRoutes);
app.use('/appts', apptRoutes);
//!******************************




/** 404 handler: matches unmatched routes; raises NotFoundError. */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Error handler: logs stacktrace and returns JSON error message. */
app.use(function (err, req, res, next) {
  const status = err.status || 500;
  const message = err.message;
  if (process.env.NODE_ENV !== "test") console.error(status, err.stack);
  return res.status(status).json({ error: { message, status } });
});
// end


module.exports = app;