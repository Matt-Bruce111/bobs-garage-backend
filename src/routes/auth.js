// Import express, bcrypt, and db
const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../models');
const { writeFileSync } = require("fs")

// Import middleware
const auth = require('../middleware/auth');

// Import validation schema
const { authSchema } = require('../utils/authValidation');

// Get the router object from express
const router = express.Router();

// Destructure user from db model
const { User } = db.sequelize.models;

// AUTH ROUTES
// Login
router.post('/', async (req, res) => {
  // Log the triggered endpoint
  console.log('/api/auth - POST - Login')
  
  try {
    // Validate the request body
    const validated = await authSchema.validateAsync(req.body)
    console.log('Validated data')
    console.log(validated)

    // Destructure the validated request body
    const { email, password } = validated

    // Check if the user exists in the database
    let user = await User.findOne({ where: { email } })

    // If the user is not in the db, send back a general message
    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] })
    }

    // Check if the entered password matches the password in the db
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] })
    }
    
    // Create a payload
    const payload = {
      user: {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        image: user.image,
        isAdmin: user.isAdmin
      }
    }

    // Sign the token
    const token = User.prototype.signToken(payload)
    //console.log(token)
    res.json({ token })
  
  // If there are any errors, send them to the client
  } catch (error) {
    // Check if the error is a joi error
    if(error.isJoi === true) {
      error.status = 422
      res.status(422).json({ errors: [{ msg: error.message }] })
      return
    }

    // Log the error
    console.error(error.message)
    res.status(500).json({ errors: [{ msg: 'Server Error'}] })
  }
})

// Load user
router.get('/', auth, async(req, res) => {
  console.log('/api/auth - GET - Load User')

  // Create options so that the db doesnt send back the password field
  const options = {
    attributes: { exclude: ['password'] }
  }

  try {
    console.log(req.user)
    // Validate the request body
    const validated = await authSchema.validateAsync(req.user)
    console.log(validated)

    // Destructure the validated request body
    const { userId } = validated

    // Find the user by id
    const user = await User.findByPk(userId, options)

    // Log the user
    // console.log(user)

    // Send the user back to the client
    res.json(user)
  } catch (error) {
    // Check if the error is a joi error
    if(error.isJoi === true) {
      error.status = 422
      res.status(422).json({ errors: [{ msg: error.message }] })
      return
    }

    // Log the error
    console.error(error.message)
    res.status(500).json({ errors: [{ msg: 'Server Error'}] })
  }
})

// Export the router
module.exports = router;