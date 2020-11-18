const mongoose = require('mongoose')

const carSchema = new mongoose.Schema({

    carType: {
        type: String,
        required: true
    },

    plateNo: {
        type: String,
        required: true
    }
})

const Cars = mongoose.model('Cars', carSchema)
module.exports = Cars 