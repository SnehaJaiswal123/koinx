const express = require('express')
const router = express.Router();
const {calculateBalace} =require('../contollers/trade')

// calculateBalace()

router.post('/calc',calculateBalace)

module.exports = router