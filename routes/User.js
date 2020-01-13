const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");
// Load Post Model
require("../models/User");
const User = mongoose.model("Users");

// Register Post
router.post("/register", (req, res) => {
  console.log(req.body);
  let errors = [];
  if (req.body.password != req.body.password2) {
    errors.push({ text: "Passwords must match" });
  }
  if (req.body.password.length < 4) {
    errors.push({ text: "Password must be greater than 3 characters" });
  }

  if (req.length > 0) {
    console.log("Fill in the required fields");
  } else {
    User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        res.send("Email is taken");
        console.log("Email is taken");
      } else {
        const newUser = {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        };

        bcrypt.genSalt(15, (error, salt) => {
          bcrypt.hash(newUser.password, salt, (error, hash) => {
            if (error) throw error;
            newUser.password = hash;
            new User(newUser)
              .save()
              .then(user => {
                console.log(`Registration for  ${newUser.email} is complete.`);
              })
              .catch(error => {
                console.log(error);
              });
          });
        });
        console.log(newUser);
        res.send("Register");
      }
    });
  }
});

// Login Post Form

router.post("/login", (req, res, next) => {
  req.session.cookie.expires = false;
  req.session.cookie.maxAge = 5 * 60000 * 10000000;
  console.log(req.session);
  passport.authenticate("local", {
    successRedirect: "/posts",
    failureRedirect: "fail"
  })(req, res, next);
});

// Logout request
router.get("/logout", (req, res) => {
  res.send("Logged Out");
  console.log("Logged Out");
  req.logout();
});

module.exports = router;
