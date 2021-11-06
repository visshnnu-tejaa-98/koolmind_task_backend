const mongoose = require('mongoose');

const connectDB = async () => {
	try {
		const connect = await mongoose.connect(process.env.MONGODB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log(`Connected to database ${connect.connection.host}`);
	} catch (error) {
		console.log(error.message);
		process.exit(1);
	}
};

module.exports = connectDB;
