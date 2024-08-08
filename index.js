const express = require('express')
const app=express();
require('dotenv').config()
const port = process.env.PORT
require('./db/connection')

app.listen(port,console.log(`server is running on ${port}`))
