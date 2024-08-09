const express = require('express')
const app=express();
require('dotenv').config()
require('./db/connection')

const port = process.env.PORT
const trade=require('./routes/trade')

app.use(express.json())
app.use('/api/v1',trade) //routes trade APIs

app.listen(port,console.log(`server is running on ${port}`))
