const mongoose = require('mongoose')
const passportLocalMongoose = require("passport-local-mongoose")
const adminSchema = new mongoose.Schema({
	fullName:{
        type:String,
        required:true
    },
	email:{
		type:String,
		unique:true,
		required:true
	},
    username:{
        type:String,
		unique:true,
        required:true
    },
    password:{
        type:String,
		unique:true,
        required:true
    }   
})

adminSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model("Admin", adminSchema)