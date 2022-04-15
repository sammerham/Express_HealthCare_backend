"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");
const express = require("express");
const { ensureAdmin, ensureCorrectUserOrAdmin } = require("../middleware/auth");
const { BadRequestError, ExpressError, NotFoundError } = require("../ExpressError/expressError");
const User = require("../models/user");
const { createToken } = require("../helper/token");
const userNewSchema = require("../schemas/userNew.json");
const userUpdateSchema = require("../schemas/userUpdate.json");

const router = express.Router();


/** POST / { user }  => { user, token }
 *
 * Adds a new user. This is not the registration endpoint --- instead, this is
 * only for admin users to add new users. The new user being added can be an
 * admin.
 *
 * This returns the newly created user and an authentication token for them:
 *  {user: { username, firstName, lastName, email, isAdmin }, token }
 *
 * Authorization required: admin
 **/

router.post("/", ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    console.log('data coming from client --->>', req.body)
    const user = await User.register(req.body);
    console.log('user after called from client ---->>', user)
    const token = createToken(user);
    return res.status(201).json({ user, token });
  } catch (err) {
    return next(err);
  }
});


/** GET / => { users: [ {username, firstName, lastName, email }, ... ] }
 *
 * Returns list of all users.
 *
 * Authorization required: admin
 **/

router.get("/", ensureAdmin, async function (req, res, next) {
  try {
    const users = await User.findAll();
    return res.status(200).json({ users });
  } catch (err) {
    return next(err);
  }
});


/** GET /[username] => { user }
 *
 * Returns { username, firstName, lastName, isAdmin, jobs }
 *   where jobs is { id, title, companyHandle, companyName, state }
 *
 * Authorization required: admin or same user-as-:username
 **/

router.get("/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    const user = await User.getByUsername(req.params.username);
    return res.status(200).json({ user });
  } catch (err) {
    return next(err);
  }
});


/** POST /name - returns `{user: { username, first_name, last_name, is_admin }}` */


router.post("/name",ensureAdmin, async function (req, res, next) {
  try {
    const { firstName, lastName } = req.body;
    if ((firstName === '' || lastName === '') ) throw new ExpressError('First name and Last name are required', 404);
    const user = await User.getByName(firstName, lastName);
    if (!user) throw new NotFoundError(`No user found with this name: ${firstName} ${lastName}`, 404);
    return res.status(200).json({ user });
  } catch (e) {
    return next(e);
  }
});

/** PATCH /[username] { user } => { user }
 *
 * Data can include:
 *   { firstName, lastName, password, email }
 *
 * Returns { username, firstName, lastName, email, isAdmin }
 *
 * Authorization required: admin or same-user-as-:username
 **/

router.patch("/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const user = await User.update(req.params.username, req.body);
    return res.status(200).json({ user });
  } catch (err) {
    return next(err);
  }
});


/** DELETE /[username]  =>  { deleted: username }
 *
 * Authorization required: admin 
 **/

router.delete("/:username", ensureAdmin, async function (req, res, next) {
  try {
    await User.remove(req.params.username);
    return res.status(200).json({ deleted: req.params.username });
  } catch (err) {
    return next(err);
  }
});



module.exports = router;