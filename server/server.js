require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

connectDB();

const app = express();
app.use(cors());
app.use(express.json());
<<<<<<< HEAD
=======
// SSLCommerz posts its success/fail/cancel/ipn callbacks as form-encoded
// bodies, not JSON.
app.use(express.urlencoded({ extended: true }));
>>>>>>> 1ac65f253f4e61b550de509defdd255d6ba8b75f

app.get('/', (req, res) => res.send('MotoFix API is running'));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/vendor', require('./routes/vendorRoutes'));
app.use('/api/vehicles', require('./routes/vehicleRoutes'));
app.use('/api/parts', require('./routes/partRoutes'));
app.use('/api/customization', require('./routes/customizationRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/builds', require('./routes/customBuildRoutes'));
app.use('/api/vendor/requests', require('./routes/vendorRequestRoutes'));
<<<<<<< HEAD
app.use('/api/geocode', require('./routes/geocodeRoutes'));
=======

>>>>>>> 1ac65f253f4e61b550de509defdd255d6ba8b75f
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
