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
const eventRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");
var Binary = require('mongodb').Binary;
// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;
const { request, response } = require("express");


eventRoutes.route("/events").get(function (req, res) {
    let db_connect = dbo.getDb("memorinda");
    db_connect
      .collection("events")
      .find({})
      .toArray(function (err, result) {
        if (err) throw err;
        res.json(result);
      });
  });


  eventRoutes.route("/events/add").post(function (req, response) {

    let db_connect = dbo.getDb("memorinda");
    
    let event = {
      eventName: req.body.eventName,
      eventDescription: req.body.eventDescription,
      eventLocation: req.body.eventLocation,
      eventDate: req.body.eventDate,
      eventCapacity: req.body.eventCapacity,
    };
    console.log(event);
   
   
    db_connect.collection("events").find({ "eventName": req.body.eventName }).toArray()
    .then((result) => {
        if (result.length === 0) {
        db_connect.collection("events").insertOne(event, function (err, res) {
            if (err) throw err;
            response.json(res);
        });
        }
        else {
        response.json({ message: 'This event name has already been used!' });
        }
    })
  
  });


  eventRoutes.route("/events/buy-ticket").post(function (req, res) {
    eventID = req.body.eventID;
    console.log(eventID);
    res.json("bought ticket");
  });
  module.exports = eventRoutes;