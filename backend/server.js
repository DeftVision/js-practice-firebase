require('dotenv').config();
const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 8001;
const connectDB = require('./config/db');
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.listen(port, () => console.log(`Server started on port ${port}`));
