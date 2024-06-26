const express  = require('express')
const app = express()
const apiPath  = require('./Routes/apiRoute')
const bodyParser = require('body-parser');
require('dotenv').config()
app.use(bodyParser.json());
const PORT = process.env.PORT;

app.use('/', apiPath)



app.listen(PORT, console.log(`app is running at port ${PORT}`))
