const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 8000;

dotenv.config();
connectDB();

app.use(express.json());
app.use(cors());
app.use('/api/v1/user', userRoutes);

app.get('/', (req, res) => {
	res.send('Hello');
});

app.listen(PORT, () => console.log(`Server is up and running on ${PORT}`));
