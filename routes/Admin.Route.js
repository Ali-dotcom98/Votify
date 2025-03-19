
const express = require("express")
const Route = express.Router();
const Candidate = require('../Models/Candidate.model')

Route.get("/",async (req,res)=>{
    try {

        const data = await Candidate.find();
        res.render("AdminHome",{data : data})

    } catch (error) {
        console.log(error)
    }
})
Route.get("/AddCandidate",(req,res)=>{
    res.render("AddCandidate")
})

Route.post("/AddCandidate", async(req,res)=>{
    try {
        // Convert req.body to a plain object if needed
        const data =req.body
        console.log("Frontend", data);
        const addcandidate = new Candidate(data);
        const TransferData = await addcandidate.save(); 

        if(TransferData != null) {
            console.log("Data saved successfully");
            res.redirect("/Admin")
        }

    } catch (error) {
        console.error("Error saving candidate:", error);
        res.status(500).json({ message: "Error saving candidate", error: error.message });
    }
});

Route.get("/Candidate/View/:id",async(req,res)=>{
    try {
        console.log("I am here")
        const id = req.params.id;
        const data = await Candidate.findById(id)
        if(data==null)
        {
            console.log("Invalid Id")
            res.redirect("/Admin")
        }
        else
        {
            res.render("CandidateView",{data: data})
        }
    } catch (error) {
        
    }
})


Route.get("/Candidate/Update/:id",async(req,res)=>{
    try {
        const id = req.params.id;
        const data = await Candidate.findById(id)
        console.log(data)
        if(data==null)
        {
            console.log("Invalid Id")
            res.redirect("/Admin")
        }
        else
        {
            res.render("CandidateUpdate",{data: data})
        }
    } catch (error) {
        
    }
})

Route.post("/Candidate/Update/:id", async (req, res) => {
    try {
        const id = req.params.id;

        // Correct method name: findByIdAndUpdate
        const data = await Candidate.findByIdAndUpdate(id, req.body, { new: true });

        if (data == null) {
            console.log("Invalid Id");
            res.redirect("/Admin");
        } else {
            console.log("Candidate updated successfully");
            res.redirect("/Admin");
        }
    } catch (error) {
        console.error("Error updating candidate:", error);
        res.status(500).json({ message: "Error updating candidate", error: error.message });
    }
});

Route.get("/Candidate/Delete/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Candidate.deleteOne({_id :id})
        console.log(data)
        if (data.acknowledged == true) {
            console.log("Candidate Deleted successfully");
            res.redirect("/Admin");
            
        } else {
            console.log("Invalid Id");
            res.redirect("/Admin");
        }
    } catch (error) {
        console.error("Error updating candidate:", error);
        res.status(500).json({ message: "Error updating candidate", error: error.message });
    }
});

module.exports = Route;