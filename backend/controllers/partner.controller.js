const partnerModel = require('../models/partner.model');
const partnerService = require('../services/partner.service');
const { validationResult } = require('express-validator');

module.exports.registerPartner = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password, vehicle } = req.body;

    const isPartnerExist = await partnerModel.findOne({ email });
    if (isPartnerExist) {
      return res.status(400).json({ message: 'Partner already exists' });
    }

    const hashedPassword = await partnerModel.hashPassword(password);

    const partner = await partnerService.createPartner({
      firstname: fullname.firstname,
      lastname: fullname.lastname,
      email,
      password: hashedPassword,
      vehicle: {
        color: vehicle.color,
        plate: vehicle.plate,
        capacity: vehicle.capacity,
        vehicleType: vehicle.vehicleType,
      },
    });

    const token = partner.generateAuthToken();
    res.status(201).json({ token, partner });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
