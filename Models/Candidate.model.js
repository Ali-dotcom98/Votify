const mongoose = require("mongoose");

const CandidateSchema = mongoose.Schema({
    Name: {
        type: String,
        Required: true,
    },
    Party: {
        type: String,
        enum :['MQM','PTI','PMLN','JI','PPP','ANP','SIC','PkMAP','NP','BNP','BAP'],
        Required: true,
    },
    Age: {
        type: Number,
        Required: true,
    },
    Telephone:
    {
        type :String,
        unique :true
    },
    Email:
    {
        type :String,
        unique :true
    },

    Vote :[
        {
            user:
            {
                type: mongoose.Schema.Types.ObjectId,
                ref :"User",
            }
        }
        
    ],

    VoteCount:
    {
        type:Number,
        default:0
    }

}, { timestamps: true })
const Candidate = mongoose.model("Candidate", CandidateSchema)

module.exports = Candidate;