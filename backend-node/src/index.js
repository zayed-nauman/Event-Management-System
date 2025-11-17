const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Log all requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is working!' });
});

// Load routes with error handling
try {
    const authRoutes = require('./routes/index');
    app.use('/api/auth', authRoutes);
    console.log('Auth routes loaded successfully');
} catch (err) {
    console.error('Error loading auth routes:', err.message);
}

try {
    const eventController = require('./controllers/eventController');
    // Event routes - CRUD operations
    app.get('/api/events', eventController.getAllEvents);
    app.post('/api/events', eventController.createEvent);
    app.get('/api/events/:id', eventController.getEventById);
    app.put('/api/events/:id', eventController.updateEvent);
    app.delete('/api/events/:id', eventController.deleteEvent);
    
    // Additional event operations
    app.post('/api/events/:id/publish', eventController.publishEvent);
    app.post('/api/events/:id/cancel-or-postpone', eventController.cancelOrPostponeEvent);
    app.get('/api/user/events', eventController.getUserEvents);
    
    console.log('Event routes loaded successfully');
} catch (err) {
    console.error('Error loading event routes:', err.message);
}

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});