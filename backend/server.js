const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require('./routes/authRoute');
const carRoutes = require('./routes/carRoute');
const bookingRoutes = require('./routes/bookingRoute');
const userRoutes = require('./routes/userRoute');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Car Rental API running " });
});

const PORT = process.env.PORT ;

app.use('/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});