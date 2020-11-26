const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({

    passenger_name: {
        type: String,
        required: true
    },

    pickup_location: {
        type: String,
        required: true
    },

    dropoff_location: {
        type: String,
        required: true
    },

    pickup_time: {
        type: String,
        required: true
    },

    dropoff_time: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        required:true
    },

    car: {
        type: String,
        required: true
    },

    number_of_passengers: {
         type: Number,
         required: true
    }
})

const Bookings = mongoose.model('Bookings', bookingSchema)
module.exports = Bookings 