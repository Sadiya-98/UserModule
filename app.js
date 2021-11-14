require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoutes = require("./routes/auth")

//DB Connections
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.DATABASE,{
      useNewUrlParser:true,
      useUnifiedTopology:true,
      autoIndex: true
  }).then(()=>
    console.log("DB CONNECTED")
    )
}

//middlewares
app.use(express.json())
app.use(cookieParser())
app.use(cors())

//My Routes
app.use("/api", authRoutes);

//PORT
const port = process.env.PORT || 8000;

//Starting a server
app.listen(port, ()=>{
    console.log(`App is running at ${port}`);
})
