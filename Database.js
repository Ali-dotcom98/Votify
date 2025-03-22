const mongoose = require('mongoose');

// const mongoURL = "mongodb://127.0.0.1:27017/VoterSystem";

const dotenv = require("dotenv");
dotenv.config();
const mongoURL = process.env.URL;



mongoose.connect(mongoURL);
const db = mongoose.connection;

db.on('connected', () => {
    console.log('Connected to MongoDB Server');
});

db.on('error', (error) => {
    console.log('Error', error);
});

module.exports = db;
