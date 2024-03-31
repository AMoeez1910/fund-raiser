const express = require("express")
const dotenv = require("dotenv").config()
const cors = require('cors')
const app = express()
const cookieParser = require('cookie-parser')
const connection = require("./models/db")
const stripe = require ("./routes/stripe")
const corsOptions ={
    origin:'https://faryaad.netlify.app', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions))
//middleware
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:false}))
app.use('/',require('./routes/authRoutes'))
app.use("/donate",stripe)
const port = process.env.PORT || 3000;

app.listen(port, "0.0.0.0",() => {
console.log("Server is running on port 3000")
connection.connect(function(err){
    if(err) throw err;
    console.log('Database Connected')
})})
