const express = require('express')
const router = express.Router()

const {register} = require('../Controllers/user')
router.post('/register', register)

module.exports = router