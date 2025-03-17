// Import express and any required modules
const express = require('express');
const cors = require('cors')
// Import our db from our models folder.
const db = require('./models');
// Bring in our config file.
const config = require('./config/config')

// Import our routes
const users = require('./routes/users');
const services = require('./routes/services');
const auth = require('./routes/auth');
const feedback = require('./routes/feedback');
const blog = require('./routes/blog');

// Initialise express app variable
const app = express();

PORT = 3500

// This middleware allows the server to parse incoming requests with JSON data.
app.use(express.json({ limit: '10mb'}));
// This middleware allows the server to parse incoming requestions with url-encoded data.
app.use(express.urlencoded({ extended: true }));
// Increase the limit of data that can be sent to the server.

app.use(cors())

// Use our routes
app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/services', services);
app.use('/api/feedback', feedback);
app.use('/api/blog', blog);

app.get('/', (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
})

// Start the server with sequelize
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Bob's Garage started on port ${PORT}`)
  })
})
