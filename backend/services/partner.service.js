const partnerModel = require('../models/partner.model');

const createPartner = async ({
  firstname,
  lastname,
  email,
  password,
  vehicle
}) => {
  if (!firstname || !email || !password || !vehicle) {
    throw new Error("Missing required fields");
  }

  const partner = await partnerModel.create({
    fullname: {
      firstname,
      lastname
    },
    email,
    password,
    vehicle: {
      color: vehicle.color,
      plate: vehicle.plate,
      capacity: vehicle.capacity,
      vehicleType: vehicle.vehicleType
    }
  });

  return partner;
};

module.exports = {
  createPartner
};
