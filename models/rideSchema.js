const mongoose = require('mongoose')

const rideSchema = new mongoose.Schema({

    pickup_location: {
        type: String,
        required: true
    },

    dropoff_location: {
        type: String,
        required: true
    }
})

const Rides = mongoose.model('Rides', rideSchema)
module.exports = Rides 