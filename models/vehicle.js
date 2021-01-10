const mongoose = require('mongoose');

const vehicleShema = new mongoose.Schema({
    serialno: Number,
    vehicleType: String,
    model: String,
    mileage: Number
});

const vehicle = mongoose.model('MotorCycleList', vehicleShema);

module.exports = vehicle;