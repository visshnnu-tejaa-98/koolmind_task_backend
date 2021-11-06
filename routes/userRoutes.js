const express = require('express');
const {
	registerUser,
	verifyOtp,
	resendOtp,
	loginUser,
	forgot,
	reset,
	user,
} = require('../controllers/userController');
const { Authenticate } = require('../middleware');
const Router = express.Router();

Router.post('/regsiter', registerUser);
Router.post('/verifyOtp', verifyOtp);
Router.put('/resendOtp', resendOtp);
Router.post('/login', loginUser);
Router.put('/forgot', forgot);
Router.put('/reset', reset);
Router.get('/', [Authenticate], user);

module.exports = Router;
