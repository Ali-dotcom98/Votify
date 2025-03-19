const Login = require('../Models/LoginUser.model')
const express = require("express")
const Route = express.Router();
const { GenerateToken, Validation } = require("../utility/Login.Toke")
const bcrypt = require("bcrypt")
const otpGenerator = require("otp-generator")
const { check, validationResult } = require("express-validator");
const { CheckRecoveryToken, RecoveryTokenGenerate, ValidatePasswordRecovery } = require("../utility/ForgetToken")
const { transporter, SendMail } = require("../utility/Gmail");
const path = require('path');
Route.get("/Login", (req, res) => {
    const message = req.flash("message");
    const success = req.flash("success");

    res.render("login", {
        layout: "./layout/Default",
        message,
        success,
        validation: [],
        Oldvalue: { Email: "", Password: "" }
    });
});


Route.post("/Login",
    check("Email")
        .isEmail()
        .withMessage("Please Enter Valid Email")
    ,
    check("Password", "Password Should be Lenght of 5").isLength({ min: 5 }).isAlphanumeric()
    ,
    async (req, res) => {
        try {

            const data = req.body;
            const FindUser = await Login.findOne({
                Email: data.Email,
            })
            const error = validationResult(req);
            if (!error.isEmpty()) {
                const errorList = error.array();
                const message = error.array()[0].msg;
                console.log(errorList)
                req.flash("message", message[0].msg);
                res.render("login", { "layout": "./layout/Default", message, validation: error.array(), Oldvalue: { Email: data.Email, Password: data.Password } })
            }
            console.log("User exist", FindUser)
            if (FindUser != null) {
                console.log(data.Password)
                const compare = await bcrypt.compare(data.Password, FindUser.Password)
                if (compare == true) {
                    const payload = {
                        id: FindUser.id,
                        Email: FindUser.Email,
                        LoginInfo: FindUser.User
                    };

                    const token = GenerateToken(payload);
                    const IsValid = Validation(token);
                    res.cookie("uid", token)
                    res.redirect("/home")
                }
                else {
                    console.log("Incorrect UserName or Password")
                    const message = "Incorrect UserName or Password";
                    res.render("login", { "layout": "./layout/Default", message, validation: [{ path: "Email" }, { path: "Password" }], Oldvalue: { Email: data.Email, Password: data.Password } })

                }
            }
            else {
                console.log("Incorrect UserName or Password")
                req.flash("message", "Incorrect UserName or Password")
                return res.redirect("/Site/Login")
            }


        } catch (e) {
            const error = new Error(e);
            error.httpStatusCode = 500;
            console.log(error)
        }

    })

Route.get("/Signup", (req, res) => {
    const message = req.flash("message");
    res.render("Signup",
        { "layout": "./layout/Default", message, Oldvalue: { Email: "", Password: "" }, validation: [] });
});

Route.post("/Signup",
    check("Username")
        .isEmail()
        .withMessage("Please Enter Valid Email")
        .custom((value, { req }) => {
            var Regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!Regex.test(value)) {
                // req.flash("message", `${value} Should folloew Pattren example@example.com`);
                throw new Error(`${value} Should folloew Pattren example@example.com`)
            }
            return true;

        })

    ,
    check("Password", "Password Should be Lenght of 5").isLength({ min: 5 }).isAlphanumeric()
    , async (req, res) => {
        try {
            const data = req.body;
            const error = validationResult(req);
            if (!error.isEmpty()) {
                const message = error.array()[0].msg;
                return res.render("Signup",
                    {
                        "layout": "./layout/Default",
                        message,
                        Oldvalue: { Email: data.Username, Password: data.Password },
                        validation: error.array()
                    });
            }
            const IsExist = await Login.findOne({ Email: data.Email })
            if (!IsExist) {
                let otp = otpGenerator.generate(4, {
                    upperCaseAlphabets: false,
                    lowerCaseAlphabets: false,
                    specialChars: false,
                });
                console.log(otp)
                const salt = await bcrypt.genSalt(10);
                const NewPassword = await bcrypt.hash(data.Password, salt);
                const Payload =
                {
                    Email: data.Username,
                    Password: NewPassword,
                    OTP: otp
                }
                console.log(JSON.stringify(Payload))
                res.cookie("OTP", Payload)
                var mailOptions = {
                    from: {
                        name: "Ali",
                        address: "alishah19477.as@gmail.com"
                    },
                    to: data.Username,
                    subject: 'Your OTP Code for Account Verification',
                    text: `Hello Ali,\n\nYour OTP code is: ${otp}\n\nPlease enter this code to verify your account. If you did not request this, please ignore this message.\n\nBest regards,\nYour Team\n\nThis is an automated message. Please do not reply directly to this email.`,
                    html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Email Template</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            color: #333;
                            margin: 0;
                            padding: 20px;
                            background-color: #f4f4f4;
                        }
                        .container {
                            max-width: 600px;
                            margin: auto;
                            background: #fff;
                            padding: 20px;
                            border-radius: 8px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }
                        h1 {
                            color: #333;
                        }
                        p {
                            line-height: 1.6;
                        }
                        .otp-box {
                            font-size: 1.5em;
                            font-weight: bold;
                            background-color: #f0f0f0;
                            padding: 10px;
                            border-radius: 8px;
                            display: inline-block;
                            margin: 20px 0;
                        }
                        .footer {
                            margin-top: 20px;
                            font-size: 0.8em;
                            color: #777;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Hello Ali,</h1>
                        <p>Please use the following OTP code to verify your account:</p>
                        <div class="otp-box">${otp}</div>
                        <p>If you did not request this, please ignore this message.</p>
                        <div class="footer">
                            <p>This is an automated message. Please do not reply directly to this email.</p>
                        </div>
                    </div>
                </body>
                </html>
                `
                };
                SendMail(transporter, mailOptions)

                res.redirect("/OTP")
            }
            else {
                const message = "Email Should be Unique";
                return res.render("Signup",
                    {
                        "layout": "./layout/Default",
                        message,
                        Oldvalue: { Email: data.Username, Password: data.Password },
                        validation: [{ path: "Username" }],
                    });
            }



        } catch (error) {
            console.log("error", error);
        }
    });

Route.get("/Forgot", (req, res) => {
    var message = req.flash("message");
    res.render("Forget", { "layout": "./layout/Default", message })
})

Route.post("/Forgot",
    check("Email")
        .isEmail()
        .withMessage("Invalid Format")
    ,
    async (req, res) => {
        try {
            const { Email } = req.body;
            const ISEmail = await Login.findOne({ Email: Email })
            const error = validationResult(req);
            if (!error.isEmpty()) {
                console.log(error.array())
                req.flash("message", error.array()[0].msg)
                res.redirect("/Site/Forgot")
            }

            if (ISEmail) {
                Payload =
                {
                    Email: Email
                }
                console.log(JSON.stringify(Payload))
                const Token = RecoveryTokenGenerate(Payload)
                console.log(Token)
                res.cookie("RecoveryUid", Token)
                const IsValid = ValidatePasswordRecovery(Token)
                if (IsValid) {
                    var mailOptions = {
                        from: {
                            name: "Ali",
                            address: "alishah19477.as@gmail.com"
                        },
                        to: Email,
                        subject: 'Forget Password Request',
                        text: 'Hello Ali,\n\nWe hope this email finds you well. This is a sample email template that you can use to send messages to your contacts.\n\nFeel free to customize this template to fit your needs. You can add more sections, links, or images as needed.\n\nBest regards,\nYour Name\n\nThis is an automated message. Please do not reply directly to this email.',
                        html: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="UTF-8">
                        <title>Email Template</title>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                color: #333;
                                margin: 0;
                                padding: 20px;
                                background-color: #f4f4f4;
                            }
                            .container {
                                max-width: 600px;
                                margin: auto;
                                background: #fff;
                                padding: 20px;
                                border-radius: 8px;
                                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                            }
                            h1 {
                                color: #333;
                            }
                            p {
                                line-height: 1.6;
                            }
                            .footer {
                                margin-top: 20px;
                                font-size: 0.8em;
                                color: #777;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h1>Hello From Ali,</h1>
                            <p> Click on link for Reset Password  <a href="http://localhost:3000/Site/ChangePassword"> Reset</a> </p>
                            <div class="footer">
                                <p>This is an automated message. Please do not reply directly to this email.</p>
                            </div>
                        </div>
                    </body>
                    </html>
                    `
                    };
                    SendMail(transporter, mailOptions);
                    req.flash("success", "Email is Sent");
                    res.redirect("/Site/Login");

                }
            }
            else {
                req.flash("message", "Email is Not Regisered")
                res.redirect("/Site/Forgot")
            }
        } catch (error) {

        }
    })


Route.get("/ChangePassword", CheckRecoveryToken, (req, res) => {
    try {
        var message = req.flash("message")
        res.render("ChangePassword", { "layout": "./layout/Default", message })
    } catch (error) {
        console.log(error)
    }
});

// Route to handle password change submission
Route.post("/ChangePassword"
    ,
    check("Password", "Password Should be Lenght of 5").isLength({ min: 5 }).isAlphanumeric(),
    check("CPassword", "Password Should be Lenght of 5").isLength({ min: 5 }).isAlphanumeric()
    , async (req, res) => {
        try {
            const token = req.cookies?.RecoveryUid
            const { Password, CPassword } = req.body;
            const validate = ValidatePasswordRecovery(token)
            const error = validationResult(req);
            if (!error.isEmpty()) {
                req.flash("message", error.array()[0].msg)
                return res.redirect("/Site/ChangePassword")
            }
            if (validate) {
                console.log(validate)
                const Email = validate.Data.Email;
                console.log(Email)
                if (Password !== CPassword) {
                    req.flash("message", "Password are Not matched")
                    return res.redirect("/Site/ChangePassword")
                }

                const salt = await bcrypt.genSalt(10);
                const NewPassword = await bcrypt.hash(Password, salt)
                console.log(NewPassword)

                const LoginData = await Login.updateOne(
                    {
                        Email: validate.Data.Email
                    },
                    {
                        $set:
                        {
                            Password: NewPassword
                        }
                    }
                )

                console.log(LoginData)
                req.flash("success", "Change successful!");
                res.redirect("/Site/Login")

            }



        } catch (error) {
            console.log(error);
            res.status(500).send("An error occurred.");
        }
    });




module.exports = Route