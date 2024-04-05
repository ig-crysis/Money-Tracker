const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const app = express();
app.use(express.static('Public'));
dotenv.config();
const port = process.env.PORT || 3000

const dbURI = process.env.MONGODB_URI;
mongoose.connect(dbURI, {
  }).then(() => {
    console.log("Connected to MongoDB");
  }).catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

const moneySchema = new mongoose.Schema({
    info : String,
    date : Date,
    amount : Number
});
const moneyTracker = mongoose.model("MoneyTracker",moneySchema);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/",(req, res)=>{
    res.sendFile("index.html");  
})

app.post("/add", async (req, res)=> {
    try {
        const { info, date, amount } = req.body;
        const moneyData = new moneyTracker({
            info,
            date,
            amount
        });
        await moneyData.save();
        console.log("Data saved successfully:", moneyData);
        res.status(201).send("Data saved successfully");
    } catch (error) {
        console.error("Error saving data:", error);
        res.status(500).send("Internal server error");
    }
});

app.listen(port, ()=>{
    console.log(`server is running on port ${port}`);
})