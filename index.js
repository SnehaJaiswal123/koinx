const express = require('express')
const app=express();
require('dotenv').config()
const port = process.env.PORT
require('./db/connection')
const trade=require('./routes/trade')
app.use(express.json())
app.use('/',trade)


app.listen(port,console.log(`server is running on ${port}`))
