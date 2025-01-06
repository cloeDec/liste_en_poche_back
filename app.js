const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const listRoutes = require('./routes/listRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/lists', listRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
