require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('MotoFix API is running'));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/vendor', require('./routes/vendorRoutes'));
app.use('/api/vehicles', require('./routes/vehicleRoutes'));
app.use('/api/parts', require('./routes/partRoutes'));
app.use('/api/customization', require('./routes/customizationRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/vendor/requests', require('./routes/vendorRequestRoutes'));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
