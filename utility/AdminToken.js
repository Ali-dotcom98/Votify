const jwt = require("jsonwebtoken")

const dotenv = require("dotenv")
dotenv.config()

const Secret = process.env.ADMIN_SECRET

const GenerateAdminToken = (payload)=>{
    return jwt.sign({AdminInfo : payload}, Secret , { expiresIn: '1h' })
}
const ValidateAdminToken = (Token)=>{
    return jwt.verify(Token, Secret)
}


const AdminCheck = (req,res,next )=>{
    try 
    {
        const token = req.cookies.AdminUid;
        if(token==null)
        {
            console.log("No Permission (token = Null)")
            return res.redirect("/LoginAdmin")
        }
            

        const Isvalid = ValidateAdminToken(token);

        if(Isvalid==null)
        {
            req.flash("message","Authorized User Allowed")
            return res.redirect("/home")
        }
        // console.log("Token is Authentic")
        next();
    } catch (error) {
        console.log("error", error)
    }
}

module.exports = {ValidateAdminToken , GenerateAdminToken , AdminCheck}