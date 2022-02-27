require("dotenv").config();
const express = require('express');
const cors = require('cors')

//import routes
const authentication = require('./routes/authentication.routes');
const dashboard = require('./routes/dashboard.routes');

//middleware
const verifyToken = require('./middleware/authentication.middleware');

//Create app
const app = express();
app.use(express.json());
app.disable('x-powered-by')

//CORS
const corsOptions = {
  origin: process.env.APP_URL
}
app.use(cors(corsOptions))

//Router
app.use('/api', authentication);
app.use('/api/dashboard', verifyToken, dashboard);



module.exports = app;