const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const partnerSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
      minLength: [3, 'Firstname must be at least 3 characters long']
    },
    lastname: {
      type: String,
      required: true,
      minLength: [3, 'Lastname must be at least 3 characters long']
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  socketId: String,
  status: {
    type: String,
    enum: ['available', 'unavailable'],
    default: 'unavailable'
  },
  vehicle: {
    color: {
      type: String,
      required: true,
      minlength: [3, "Color must be at least 3 characters long"]
    },
    plate: {
      type: String,
      required: true,
      minlength: [3, "Plate must be at least 3 characters long"]
    },
    capacity: {
      type: Number,
      required: true,
      min: [1, 'Capacity must be at least 1']
    },
    vehicleType: {
      type: String,
      required: true,
      enum: ['motorcycle', 'car', 'auto']
    }
  },
  location: {
    lat: Number,
    lng: Number
  }
});

partnerSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

partnerSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

partnerSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

module.exports = mongoose.model('Partner', partnerSchema);
