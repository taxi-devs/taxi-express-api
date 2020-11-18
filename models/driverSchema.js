const mongoose = require('mongoose')

const driverSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    age: {
        type: String,
        min:20,
        max:50,
        required: true
    },

    phone: {
        type: String,
        required: true
    }
})

const Drivers = mongoose.model('Drivers', driverSchema)
module.exports = Drivers 