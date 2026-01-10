'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
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
app.use(cors({
    origin: true,
    credentials: true
})); 
app.use(express.json()); 

// Serve static files from React build
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));
}

// Basic Health Check Route
app.get('/', (req, res) => {
    if (process.env.NODE_ENV === 'production') {
        res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
    } else {
        res.send('Smart Line Management System API is Running...');
    }
});

// Health check endpoint for deployment
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is healthy' });
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

// Handle React routing - this should be AFTER all API routes
// Note: Catch-all route removed to avoid path-to-regexp issues
// Frontend routing should be handled by the deployment platform

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