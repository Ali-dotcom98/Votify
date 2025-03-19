const mongoose = require("mongoose");

const LoginUserSchema = mongoose.Schema({
    Email: {
        type: String,
        required: true,
        unique: true
    },
    Password: {
        type: String,
        required: true,
        unique: true
    },
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        default : null
    }
}, { timestamps: true });

const Login = mongoose.model("Login", LoginUserSchema);

module.exports = Login;
