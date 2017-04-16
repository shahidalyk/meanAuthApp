const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');

const config = require('./config/database');
const users = require('./routes/users');

// mongoose connection from config/database.js
mongoose.connect(config.database);

// on connection success
mongoose.connection.on('connected', () => {
	console.log('Connected to database: ' + config.database);
});

// on connection error
mongoose.connection.on('error', (error) => {
	console.log('Database connection error: ' + error);
});


// initilize express app and port
const app = express();

const port = 3000;

// Static folder for client: Angular 2 app
app.use(express.static(path.join(__dirname, 'public')));

// cors middleware to allow cross browser requests
app.use(cors());

// body-parser middleware to parse body content from form requests
app.use(bodyParser.json());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

// users route in route/users
app.use('/users', users);





// index route
app.get('/', (req, res) => {
	res.send('Express home page');
});

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'public/index.html'))
});

// start server
app.listen(port, () => {
	console.log('Express server running on: ' + port);
});