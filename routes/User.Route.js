const Login = require('../Models/LoginUser.model')
const User = require("../Models/UserVoter.model")
const express = require("express")
const Route = express.Router();
const { GenerateToken, Validation } = require("../utility/Login.Toke")



Route.get("/", (req, res) => {
    const message = req.flash("message")
    const message1 = req.flash("message1")
    res.render("UserHome", { message, message1 })
})
Route.get("/UserRegister", async (req, res) => {
    try {
        const id = req.cookies.uid;
        const LoginDetail = Validation(id);
        const Id = LoginDetail.username.id;


        const GetUser = await Login.findById(Id);
        const verify = GetUser.User;
        if (verify == null) {
            console.log("Proceeding to registration...");
            res.render("UserRegister");
        } else {
            console.log("Already registered. Redirecting to profile.");
            req.flash("message", "Already registered. Redirecting to profile.")
            res.redirect("/home");
        }

    } catch (error) {
        console.log(error);
        res.status(500).send("An error occurred.");
    }
});

Route.post("/UserRegister", async (req, res) => {
    try {
        const id = req.cookies.uid;
        const LoginDetail = (Validation(id));

        const LoginObject = await Login.findById(LoginDetail.username.id)


        const data = req.body;

        const AddData = new User(data)
        const UserObject = await AddData.save()
        console.log("Data Save")
        await Login.updateOne(
            { _id: LoginObject._id },
            { $set: { User: UserObject.id } }
        );
        req.flash("message1", "User Register successfully.")
        res.redirect("/home")
    } catch (error) {
        console.log("Error", error)
    }
})

Route.get("/UserProfile", async (req, res) => {
    try {
        const id = req.cookies.uid;
        const LoginDetail = Validation(id);
        const Id = LoginDetail.username.id;


        const GetUser = await Login.findById(Id);
        const verify = GetUser.User;
        if (verify == null) {
            console.log("Proceeding to registration...");
            req.flash("message", "Profile Doesnt Exist")
            res.redirect("/home");
        } else {
            const Userdetail = await Login.findById(Id).populate('User')
            console.log(Userdetail)
            res.render("UserProfile", { data: Userdetail })

        }

    } catch (error) {
        console.log("error", error)
    }

    // res.render("UserProfile")
})

Route.get("/UserProfile/:id", async (req, res) => {
    const UserData = await User.findById(req.params.id)
    res.render("IndividualDisplay", { data: UserData })
})
Route.get("/UserProfile/Update/:id", async (req, res) => {
    const UserData = await User.findById(req.params.id)
    const message = req.flash("message")
    res.render("IndividualUpdate", {
        data: UserData,
        message
    }
    )
})
Route.post("/UserProfile/Update/:id", async (req, res) => {
    try {
        const id = req.params.id;
        console.log("User ID:", id);

        const data = req.body;
        console.log("Update Data:", data);
        const UpdateData = await User.updateOne(
            { _id: id },
            {
                $set: {
                    Name: data.Name,
                    Age: data.Age,
                    Telephone: data.Telephone,
                    Email: data.Email,
                    Address: data.Address,
                    CNIC: data.CNIC,
                },
            }
        );
        console.log("Update", UpdateData)

        if (UpdateData.modifiedCount > 0) {
            console.log("User profile updated successfully.");
            req.flash("message", "User profile updated successfully.")
            res.redirect(`/home/UserProfile/Update/${id}`)
        } else {
            console.log("No changes were made to the user profile.");
            req.flash("message", "No changes were made to the user profile.")
            res.redirect(`/home/UserProfile/Update/${id}`)
        }
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send("An error occurred while updating the profile.");
    }
});

module.exports = Route;