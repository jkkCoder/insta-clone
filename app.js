const express = require("express")
const cors = require("cors")
const app = express()
const mongoose = require("mongoose")
const PORT = process.env.PORT || 5000
const {MONGOURI} = require("./config/keys")

mongoose.connect(MONGOURI)
mongoose.connection.on("connected",()=>{
    console.log("connected to mongodb")
})
mongoose.connection.on("error",(err)=>{
    console.log("connection error",err)
})

require("./models/user")
require("./models/post")

app.use(cors())
app.use(express.json())
app.use(require("./routes/auth"))
app.use(require("./routes/post"))
app.use(require("./routes/user"))

if(process.env.NODE_ENV==="production"){
    // app.use(express.static("client/build "))
    // const path = require("path")
    // app.get("*",(req,res)=>{
    //     res.sendFile(path.resolve(__dirname,"client","build","index.html"))
    // })

    const root = require("path").join(__dirname,"client","build")
    app.use(express.static(root))
    app.get("*",(req,res)=>{
        res.sendFile("index.html",{root})
    })
}

app.listen(PORT,()=>{
    console.log("server is running on",PORT)
})
