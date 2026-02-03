const express=require("express");
const router=express.Router();
const {body}=require('express-validator');
const partnerController=require('../controllers/partner.controller');

// const express = require("express");
// const router = express.Router();
// const { body } = require("express-validator");
// const partnerController = require("../controllers/partner.controller");

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid email address"),
    body("fullname.firstname")
      .isLength({ min: 3 })
      .withMessage("First name must be at least 3 characters"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("vehicle.color")
      .isLength({ min: 3 })
      .withMessage("Color must be at least 3 characters"),
    body("vehicle.plate")
      .isLength({ min: 3 })
      .withMessage("Plate must be at least 3 characters"),
    body("vehicle.capacity")
      .isInt({ min: 1 })
      .withMessage("Capacity must be at least 1"),
    body("vehicle.vehicleType")
      .isIn(["motorcycle", "car", "auto"])
      .withMessage("Invalid vehicle type"),
  ],
  partnerController.registerPartner
);



module.exports=router;