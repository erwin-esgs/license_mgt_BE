var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
const bodyParser = require('body-parser'); 
const {verifyToken} = require("./middleware/auth.middleware")
const {verifyAdmin} = require("./middleware/admin.middleware")

require('dotenv').config()

var app = express();
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/user',verifyToken, verifyAdmin ,require('./routes/user.route'));
app.use('/auth', require('./routes/auth.route'));
app.use('/license',verifyToken, require('./routes/license.route'));
app.use('/', require('./routes/index.route'));

module.exports = app;
