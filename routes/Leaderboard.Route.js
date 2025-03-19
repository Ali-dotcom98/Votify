const express = require("express")
const Route = express.Router()
const Candidate = require('../Models/Candidate.model')


Route.get("/", async (req, res) => {
    try {
        const data = await Candidate.find({});
        
        console.log(data.length);

        // Initialize vote counts for each party to zero
        let MQM = 0, PTI = 0, PMLN = 0, JI = 0, PPP = 0 ;
        
        // Loop through each candidate and increment their party vote count
        for (let x = 0; x < data.length; x++) {
            switch (data[x].Party) {
                case "MQM":
                    {
                        let votes = data[x].VoteCount
                        MQM = MQM + votes
                    }
                    break;
                case "PTI":
                    {
                        let votes = data[x].VoteCount
                        PTI = PTI + votes
                    }
                    break;
                case "PMLN":
                    {
                        let votes = data[x].VoteCount
                        PMLN = PMLN + votes
                    }
                    break;
                case "JI":
                    {
                        let votes = data[x].VoteCount
                        JI = JI + votes
                    }
                    break;
                case "PPP":
                    {
                        let votes = data[x].VoteCount
                        PPP = PPP + votes
                    }
                    break;
            }
        }
        const Parties =[

            {
                Party : "PTI",
                Votes : PTI,
            },
            {
                Party : "MQM",
                Votes : MQM,
            },
            {
                Party : "PMLN",
                Votes : PMLN,
            },
            {
                Party : "JI",
                Votes : JI,
            },
            {
                Party : "PPP",
                Votes : PPP,
            },

        ]
        
        // Parties.sort((a, b) => b.Votes - a.Votes);
        
        res.render('leaderboard', { parties: Parties });

    } catch (error) {
        console.log("error", error);
        res.status(500).send("An error occurred");
    }
});


module.exports = Route