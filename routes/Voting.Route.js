const Login = require('../Models/LoginUser.model')
const User = require("../Models/UserVoter.model")
const Candidate = require('../Models/Candidate.model')
const Parties = require("../utility/Parties.Info")

const express = require("express")
const Route = express.Router();
const { GenerateToken, Validation } = require("../utility/Login.Toke")



Route.get("/", async (req, res) => {
    try {
        const token = req.cookies.uid;
        const payload = Validation(token)
        const UserID = payload.username.LoginInfo
        const LoginID = payload.username.id
        if (LoginID != null) {
            const LoginTable = await Login.findById(LoginID).populate('User')
            console.log("Table", LoginTable)
            if (LoginTable.User != null) {
                const UserVoteApply = LoginTable.User.Isvoted
                if (UserVoteApply == false) {
                    res.render("VoteHome", { Parties })
                }
                else {
                    req.flash("message", "User Already have voted")
                    console.log("Already have voted")
                    res.redirect("/home")
                }
            }
            else {
                req.flash("message", "Register YourSelf")
                res.redirect("/home")
            }
        }
        else {
            req.flash("message", "Register YourSelf")
            res.redirect("/home")
        }

    } catch (error) {
        console.log(error)
        res.send(error)

    }
})

Route.get("/PartyMember/:Party", async (req, res) => {
    try {
        const id = req.params.Party;
        console.log(id);

        const Allmember = await Candidate.find({ Party: id })
        res.render("AddVote", {
            data: Allmember,
            PARTY: id
        }

        )

    } catch (error) {
        console.status(404).json({ error: error })
    }
})

Route.get("/VoteConfirm/:id", async (req, res) => {
    try {
        const token = req.cookies.uid
        const LoginPayload = Validation(token)
        const LoginID = LoginPayload.username.id
        const LoginData = await Login.findById(LoginID).populate('User')
        console.log("Login Data", LoginData)

        const UserID = LoginData.User._id.toString();
        console.log(UserID)
        const UserObject = LoginData.User;
        console.log("User Object", UserObject)
        console.log("Isvoted", UserObject.Isvoted)


        const Candidateid = req.params.id
        const GetVote = await Candidate.findById(Candidateid)
        let votecount = GetVote.VoteCount;
        votecount++
        console.log(votecount)
        const UpdateCandidateVoter = await Candidate.updateOne(
            { _id: Candidateid },
            {
                $set:
                {
                    VoteCount: votecount
                },
                $push:
                {
                    Vote:
                    {
                        user: UserID
                    }
                }
            },
        );
        const UpdateUser = await User.updateOne(
            { _id: UserID },
            {
                $set: {
                    Isvoted: true,
                    Role: GetVote.Party
                }
            },
        )


        console.log("After Update", UpdateCandidateVoter)
        console.log("After Update ", UpdateUser)

        req.flash("message1", "Vote Added")
        res.redirect("/home")



    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).send("An error occurred while processing the vote.");

    }
})

module.exports = Route;