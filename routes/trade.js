const express = require('express')
const router = express.Router();
const multer = require('multer')
const {calculateBalace,parseCSV} =require('../contollers/trade')

const upload = multer({ dest: 'uploads/' });

router.post('/calc',calculateBalace)
router.post('/parse', upload.single('file'), parseCSV)

module.exports = router