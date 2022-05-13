const express = require("express");
const bcrypt = require("bcryptjs");
const nodemailer = require('nodemailer');
const crypto = require("crypto");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const fs = require('fs');

// userRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /users.
const userRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");
var Binary = require('mongodb').Binary;
// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;
const { request } = require("express");

// This section will help you get a list of all the users.
userRoutes.route("/users").get(function (req, res) {
  let db_connect = dbo.getDb("memorinda");
  db_connect
    .collection("users")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// This section will help you get a single users by email
userRoutes.route("/users/login/:email").post(function (req, res) {
  let db_connect = dbo.getDb("memorinda");
  let myquery = {"email": req.params.email};
  let currUser = req.body.data.user;
  db_connect
    .collection("users")
    .findOne(myquery, async (err, result) => {
      if (err) console.log(err.message);
      
      if (result) {
        const validPassword = await bcrypt.compare(currUser.password, result.password);
        if (validPassword) {
          res.status(200).json(result);
        } else {
          res.status(200).json({ message: "Invalid Password" });
        }
      }
      else {
        res.status(200).json({ message: "Invalid E-mail" });
      }
    });
});

// This section will help you create a new users.
userRoutes.route("/users/signup/add").post(function (req, response) {

  let db_connect = dbo.getDb("memorinda");
  
  let user = {
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    phone: req.body.phone,
    date: req.body.date,
    email: req.body.email,
    password: req.body.password,
  };
  console.log(user);
  // hashing time
  const saltRounds = 10;

  // encrypting the password
  bcrypt.genSalt(saltRounds, function (saltError, salt) {
    if (saltError) {
      return saltError
    } else {
      bcrypt.hash(req.body.password, salt, function (hashError, hash) {
        if (hashError) {
          return hashError
        }

        user.password = hash;

        // inserting to users collection after hashing
        db_connect.collection("users").find({ "email": req.body.email }).toArray()
          .then((result) => {
            if (result.length === 0) {
              db_connect.collection("users").insertOne(user, function (err, res) {
                if (err) throw err;
                response.json(res);
              });
            }
            else {
              response.json({ message: 'This email has already been used!' });
            }
          })
      })
    }
  })

});

  // user information

module.exports = userRoutes;