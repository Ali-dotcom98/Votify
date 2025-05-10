const express = require("express")
const app = express()
const path = require("path")
const Express_layout = require("express-ejs-layouts")
const database = require("./Database")
const User = require('./Models/UserVoter.model')
const Login = require('./Models/LoginUser.model')
const Candidate = require('./Models/Candidate.model')

const cookie_parser = require("cookie-parser");
//hello
// const {GenerateToken , Validation , check }  = require("./utility/Login.Toke")
const { GenerateAdminToken, ValidateAdminToken, AdminCheck } = require("./utility/AdminToken")
const { RecoveryTokenGenerate, ValidatePasswordRecovery, CheckRecoveryToken } = require("./utility/ForgetToken")
const { IsLogin } = require("./utility/Login.Toke")
const session = require('express-session')
const flash = require("connect-flash")
const { transporter, SendMail } = require("./utility/Gmail")
const bcrypt = require("bcrypt")
app.use(session({
    secret: '12345', // Replace with your own secret
    resave: false,
    saveUninitialized: true
}));
const dotenv = require("dotenv")
dotenv.config()
app.use(flash())
app.use(express.static('public'))
app.use("\src", express.static(path.join(__dirname, "/public/src")))
app.use("\img", express.static(path.join(__dirname, "/public/img")))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(Express_layout)
app.use(cookie_parser())



app.set("view engine", "ejs")
app.set("layout", "./layout/Main");


app.get("/LoginAdmin", (req, res) => {
    try {
        res.render("AdminLogin", { "layout": "./layout/Default" })
    } catch (error) {
        console.log("error", error)
    }
})
app.post("/LoginAdmin", (req, res) => {
    try {
        console.log("Here")
        const data = req.body
        console.log(data)
        const User = data.Username
        const Pass = data.Password
        if (User == "ali" && Pass == "ali") {
            const payload = {
                LoginInfo: data.Username
            }
            const Token = GenerateAdminToken(payload)
            const content = ValidateAdminToken(Token)
            if (content) {
                res.cookie("AdminUid", Token)
                res.redirect("/Admin")
            }

        }
        else {
            req.flash("message", "Invalid User or Password")
            res.redirect("/home")
        }

    } catch (error) {
        console.log("error", error)
    }
})

// app.get("Site/ChangePassword", (req, res)=>{
//     // 
//     console.log('Hello')
// })


app.get("/Site/LogOut", (req, res) => {
    try {
        console.log("Here");
        res.cookie("uid", null, { expires: new Date(0) });
        res.redirect("/Site/Login");
    } catch (error) {
        console.log(error);
    }
});

app.get("/OTP", (req, res) => {
    res.render("otp", { "layout": "./layout/Default.ejs" })
})

app.post("/OTP", async (req, res) => {
    try {
        const data = req.cookies.OTP
        console.log("data", data)
        console.log(req.body)
        const OPT = req.body.number;

        let add = "";
        var x;
        OPT.forEach(element => {
            add = add + element
        });
        console.log(data.Email)
        if (add == data.OTP) {
            const AddUser = new Login({
                Email: data.Email,
                Password: data.Password
            });
            const Isave = await AddUser.save();
            if (Isave) {
                console.log("Data is added");
                res.redirect("/Site/Login");
            }
            else {
                res.send("Dont know")
            }


        }
        else {
            console.log("Wrong OTP")
        }
    } catch (error) {
        console.log(error)
    }
})





const LoginRoutes = require("./routes/Login&&Signup.route")
app.use("/Site", LoginRoutes)

const UserRoutes = require("./routes/User.Route")
app.use("/home", IsLogin, UserRoutes)

const AdminRoutes = require("./routes/Admin.Route")
app.use("/Admin", IsLogin, AdminRoutes)

const VoteRoutes = require("./routes/Voting.Route")
app.use("/Vote", IsLogin, VoteRoutes)

const LeaderboardRoute = require("./routes/Leaderboard.Route")
app.use("/Leaderboard", IsLogin, LeaderboardRoute)






app.listen(3000, () => {
    console.log("Server is Running at port 3000")
})
