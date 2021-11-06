const mongoose = require('mongoose');

const user = mongoose.Schema({
	name: {
		type: String,
		requried: true,
	},
	password: {
		type: String,
		requried: true,
	},
	conformPassword: {
		type: String,
	},
	otp: {
		type: Number,
	},
	mobile: {
		type: String,
		requried: true,
	},
});

const User = mongoose.model('user', user);
module.exports = { User };
