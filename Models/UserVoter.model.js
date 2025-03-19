const mongoose = require("mongoose");

const UserScheme = mongoose.Schema({
    Name: {
        type: String,
        Required: true,
    },
    Age: {
        type: String,
        Required: true,
    },
    Telephone: {
        type: String,
        Required: true,
        
    },
    Email: {
        type: String,
        unique: true,

    },
    Address:{
        type: String,
        Required: true,
    },
    CNIC:{
        type: String,
        Required: true,
        unique: true,
    },
    Role:{
        type: String,
        enum  : ['voter','admin'],
        default :'voter'
    },
    Isvoted:
    {
        type:Boolean,
        default: false
    },
    Token:
    {
        type: String
    }

}, { timestamps: true })
const User = mongoose.model("User", UserScheme)

module.exports = User;