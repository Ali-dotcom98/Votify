const jwt = require("jsonwebtoken")
const dotenv = require("dotenv");
const { ValidateAdminToken } = require("./AdminToken");
dotenv.config();
Secret_Key = process.env.Recovery_Key
const RecoveryTokenGenerate = (Payload)=>{
    return jwt.sign({Data : Payload}, Secret_Key ,{expiresIn : "1hr"})
}

const ValidatePasswordRecovery = (Token)=>{
    return jwt.verify(Token,Secret_Key)
}

const CheckRecoveryToken = (req, res, next) => {
    try {
        const token = req.cookies?.RecoveryUid;
        console.log(token)

        if (token == null) {
            console.log("No Permission (token = Null)");
            return res.redirect("/Site/Login");
        }

        const Isvalid = ValidatePasswordRecovery(token);

        if (Isvalid == null) {
            req.flash("message", "Authorized User Allowed");
            return res.redirect("/Site/Login");
        }

        // Token is valid; proceed to the next middleware
        next();
    } catch (error) {
        console.log("error", error);
    }
};


module.exports = {ValidatePasswordRecovery , RecoveryTokenGenerate , CheckRecoveryToken}