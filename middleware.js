const jwt = require('jsonwebtoken');
const Authenticate = async (req, res, next) => {
	try {
		const bearer = await req.headers['authorization'];
		// console.log(bearer);
		if (!bearer) {
			return res.json({ message: 'access failed' });
		} else {
			jwt.verify(bearer, process.env.JWT_SECRET, (err, decode) => {
				if (decode) {
					req.body.auth = decode;
					// console.log('Authentication middleware success');
					next();
				} else {
					res.json({ message: 'Authentication Failed' });
				}
			});
		}
	} catch (error) {
		console.log(error);
		res.json({ message: 'Something went wrong in authentication' });
	}
};

module.exports = { Authenticate };
