const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const config = require('../config/database');

// register
router.post('/register', (req, res, next) => {
	console.log('in register route.');
	let newUser = new User({
		name: req.body.name,
		email: req.body.email,
		username: req.body.username,
		password: req.body.password
	});

	User.addUser(newUser, (err, user) => {
		console.log('in register route => add user.' + user);
		if (err) {
			res.json({ success: false, msg:'Failed to register the user.' });
		}
		else {
			res.json({ success: true, msg:'User registered.' });
		}
	});
});

// authenticate
router.post('/authenticate', (req, res, next) => {
	const username = req.body.username;
	const password = req.body.password;

	User.getUserByUsername(username, (err, user) => {
		if (err) {
			throw err;
		}
		if(!user){
			return res.json({ success: false, msg:'User not found.'});
		}
		User.comparePassword(password, user.password, (err, isMatch) => {
			if (err) {
				throw err;
			}
			if (isMatch) {
				const token = jwt.sign(user, config.secret, {
					expiresIn: 604800 // 1 week in secs
				});

				res.json({
					success: true,
					token: 'JWT ' + token,
					user: {
						id: user._id,
						name: user.name,
						username: user.username,
						email: user.email
					}
				});
			}
			else {
				return res.json({ success: false, msg:'Wrong password'});		
			}

		});
	});
});

// profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	console.log('sdsdsd');
	res.json({user: req.user});
});


module.exports = router;