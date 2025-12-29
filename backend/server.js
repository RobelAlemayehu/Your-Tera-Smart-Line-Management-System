'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models'); 
const authRoutes = require('./routes/authRoutes');
const officeRoutes = require('./routes/officeRoutes');
const userRoutes = require('./routes/userRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
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
app.use('/api/queue', queueRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

setInterval(() => {
    sessionService.clearExpiredSessions();
}, 3600000);

// Database Sync and Server Start
const PORT = process.env.PORT || 5000;

sequelize.authenticate()
    .then(() => {
        console.log('Database connected successfully.');
        // FIXED: Using alter: true ensures columns are renamed/added for the whole team automatically
        return sequelize.sync({ alter: true }); 
    })
    .then(() => {
        console.log("Database synced and columns corrected for the whole team.");
        app.listen(PORT, () => {
            console.log(` Server is running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });