require('dotenv').config();
const express = require('express');
const cors = require('cors');
const firebaseRoutes = require('./routes/firebaseRoute');
const userRoutes = require('./routes/userRoute');
const documentRoutes = require('./routes/documentRoute');

const port = process.env.PORT || 8003;
const connectDB = require('./config/db');
connectDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/firebase', firebaseRoutes);
app.use('/api/user', userRoutes);
app.use("/api/docs", documentRoutes);

app.listen(port, () => console.log(`Server started on port ${port}`));
