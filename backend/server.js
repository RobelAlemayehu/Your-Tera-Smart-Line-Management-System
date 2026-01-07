'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/mongodb'); 
const authRoutes = require('./routes/authRoutes');
const officeRoutes = require('./routes/officeRoutes');
const userRoutes = require('./routes/userRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const profileRoutes = require('./routes/profileRoutes');

const queueRoutes = require('./routes/queueRoutes');
const adminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const sessionService = require('./services/sessionService');


const app = express();

// Middleware
app.use(cors()); 
app.use(express.json()); 

// Basic Health Check Route
app.get('/', (req, res) => {
    res.send('Smart Line Management System API is Running...');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/offices', officeRoutes); 
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/profile', profileRoutes);


app.use('/api/queue', queueRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

setInterval(() => {
    sessionService.clearExpiredSessions();
}, 3600000);

// Database Connection and Server Start
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB()
    .then(() => {
        console.log("MongoDB connected successfully!");
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
        process.exit(1);
    });