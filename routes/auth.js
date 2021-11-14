const express = require("express");
const router = express.Router();
const { check } = require('express-validator');
const { signup,login,logout,isLoggedIn, users} = require("../controllers/auth");

//Signup
router.post("/signup",[
  check("name", "name should be at least 3 char").isLength({ min: 3 }),
  check("email","please enter valid email").isEmail(),
  check("password")
  .isLength({ min: 5 })
  .withMessage('must be at least 5 chars long')
  .matches(/\d/)
  .withMessage('must contain a number')
],signup);

//Login
router.post("/login",[
    check("email","please enter valid email").isEmail(),
    check("password" ,"password field is required")
    .isLength({ min: 1 })
  ],login);

//Logout
router.get("/logout",logout);

//get all users route
router.get("/users",isLoggedIn,users)

module.exports = router;