const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');

dotenv.config();

const Secret = process.env.SECRET_KEY;

const authorization = new Map();




if (!Secret) {
    console.log('Secret key is not defined in environment variables');
}
const GenerateToken = (user) => {
    return jwt.sign({ username: user }, Secret, { expiresIn: '1h' });
};

const Validation = (Token) => {
    return jwt.verify(Token, Secret);
}

const IsLogin = (req, res, next) => {
    try {
        const token = req.cookies?.uid;
        // const token2 = req.cookies?.AdminUid;

        if (!token && !token2) {
            console.log("No Permission (token = Null)");
            return res.redirect("/Site/Login");
        }

        const Isvalid = Validation(token);

        if (Isvalid == null) {
            return res.redirect("/Site/Login");
        }

        // Token is valid; proceed to the next middleware
        next();
    } catch (error) {
        console.log("error", error);
    }
};


module.exports = { GenerateToken, Validation, IsLogin }
