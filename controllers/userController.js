const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { User } = require('../models/userModel');

const registerUser = async (req, res) => {
	try {
		console.log(req.body);
		let user = await User.find({ mobile: req.body.mobile });
		if (req.body.password != req.body.conformPassword) {
			res
				.status(400)
				.json({ data: 'password and conformPassword should be same', status: false, error: null });
		} else if (req.body.mobile.length != 10) {
			res.status(400).json({ data: 'Invalid mobile number', status: false, error: null });
		} else {
			if (user.length == 0) {
				const salt = await bcrypt.genSalt(10);
				const hash = await bcrypt.hash(req.body.password, salt);
				req.body.password = hash;
				console.log(req.body);

				// otp generation
				const otp = require('twilio')(
					process.env.TWILIO_ACCOUNT_SID,
					process.env.TWILIO_AUTH_TOKEN
				);
				let OTP = parseInt((Math.random() * 10000).toString().split('.')[0]);
				let otpResponse = await otp.messages
					.create({
						body: `Hi there, Here is your OTP ${OTP}`,
						from: '+12058465304',
						to: `+91${req.body.mobile}`,
					})
					.then((message) => console.log(message.sid));
				console.log(otpResponse);

				await User.create({
					name: req.body.name,
					password: req.body.password,
					mobile: req.body.mobile,
					otp: OTP,
				});

				res.status(200).json({ data: 'User Created', status: true, error: null });
			} else {
				res.status(400).json({ data: 'User Already Exists', status: false, error: null });
			}
		}
	} catch (error) {
		console.log(error);
		res.status(400).json({ data: 'Something went wrong', status: false, error: error.message });
	}
};

const verifyOtp = async (req, res) => {
	try {
		console.log(req.body);
		if (req.body.otp.length !== 4) {
			res.status(400).json({ data: 'Invalid OTP', status: false, error: null });
		}
		let user = await User.find({ mobile: req.body.mobile, otp: req.body.otp });
		console.log(user);
		if (user.length !== 0) {
			res.status(200).json({ data: 'User Verified', status: true, error: null });
		} else {
			res.status(400).json({ data: "Otp doesn't match", status: false, error: null });
		}
	} catch (error) {
		console.log(error);
		res.status(400).json({ data: 'Something went wrong', status: false, error: error.message });
	}
};

const resendOtp = async (req, res) => {
	try {
		const otp = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
		let OTP = parseInt((Math.random() * 10000).toString().split('.')[0]);
		let otpResponse = await otp.messages
			.create({
				body: `Hi there, Here is your resended OTP ${OTP}`,
				from: '+12058465304',
				to: `+91${req.body.mobile}`,
			})
			.then((message) => console.log(message.sid));
		await User.updateOne({ mobile: req.body.mobile }, { otp: OTP });
		console.log(otpResponse);
		res.status(200).json({ data: 'Sent OTP', status: true, error: null });
	} catch (error) {
		console.log(error);
		res.status(400).json({ data: 'Something went wrong', status: false, error: error.message });
	}
};

const loginUser = async (req, res) => {
	try {
		const user = await User.find({ mobile: req.body.mobile });
		if (user.length == 0) {
			res
				.status(400)
				.json({ data: "User doen't exist, please register", status: false, error: null });
		} else {
			let match = await bcrypt.compare(req.body.password, user[0].password);
			console.log(match);
			if (match) {
				const token = jwt.sign({ mobile: req.body.mobile }, process.env.JWT_SECRET, {
					expiresIn: '10h',
				});
				res.status(200).json({ data: 'User Allowed', status: true, error: null, token });
			} else {
				res.status(400).json({ data: 'Invalid email or password', status: false, error: null });
			}
		}
	} catch (error) {
		console.log(error);
		res.status(400).json({ data: 'Something went wrong', status: false, error: error.message });
	}
};

const forgot = async (req, res) => {
	try {
		const user = await User.find({ mobile: req.body.mobile });
		if (user.length != 0) {
			// otp generation
			const otp = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
			let OTP = parseInt((Math.random() * 10000).toString().split('.')[0]);
			let otpResponse = await otp.messages
				.create({
					body: `Hi there, Here is your OTP ${OTP}`,
					from: '+12058465304',
					to: `+91${req.body.mobile}`,
				})
				.then((message) => console.log(message.sid));
			console.log(otpResponse);
			await User.updateOne({ mobile: req.body.mobile }, { otp: OTP });
			res.status(200).json({ data: 'Sent OTP', status: true, error: null });
		} else {
			res.status(400).json({ data: 'Cant find user', status: false, error: null });
		}
	} catch (error) {
		console.log(error);
		res.status(400).json({ data: 'Something went wrong', status: false, error: error.message });
	}
};

const reset = async (req, res) => {
	try {
		const user = await User.find({ mobile: req.body.mobile });
		if (user.length == 0) {
			res.status(400).json({ data: 'Cant find user', status: false, error: null });
		} else {
			if (req.body.password == req.body.conformPassword) {
				const salt = await bcrypt.genSalt(10);
				const hash = await bcrypt.hash(req.body.password, salt);
				req.body.password = hash;
				await User.updateOne({ mobile: req.body.mobile }, { password: req.body.password });
				res.status(200).json({ data: 'Password Changed', status: true, error: null });
			} else {
				res.status(400).json({ data: 'Passwords need to match!', status: false, error: null });
			}
		}
	} catch (error) {
		console.log(error);
		res.status(400).json({ data: 'Something went wrong', status: false, error: error.message });
	}
};

const user = (req, res) => {
	res.json(req.body);
};

module.exports = { registerUser, verifyOtp, resendOtp, loginUser, forgot, reset, user };
