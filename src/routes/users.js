// Import modules
const express = require('express');
const bcrypt = require('bcrypt');

const { initializeApp } = require('firebase/app');
const { getStorage, ref, uploadBytesResumable, getDownloadURL } = require('firebase/storage');
const multer = require('multer');



// Import db models
const db = require('../models');

// Import middleware
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Import schema
const { userSchema } = require('../utils/userValidation');

// Get the router object from express
const router = express.Router();

// Destructure user from db model
const { User } = db.sequelize.models;

const firebaseConfig = {
  apiKey: "AIzaSyBkMo2AIkYReZ210pCx8HoNn06rQsMUNAw",
  authDomain: "bobs-garage-3dcc5.firebaseapp.com",
  projectId: "bobs-garage-3dcc5",
  storageBucket: "bobs-garage-3dcc5.appspot.com",
  messagingSenderId: "470721863819",
  appId: "1:470721863819:web:09217603691d1de0f9f48e"
}

// Initialize firebase
initializeApp(firebaseConfig)

const storage = getStorage()

const upload = multer({ storage: multer.memoryStorage() })

// Register
router.post('/register', async (req, res) => {
  // Log the triggered endpoint
  console.log('/api/users/resgister - POST - Register')

  try {
    // console.log(req.body)
    // var storageRef = ref(storage, req.body.image)


    //Create contentType metadata
    // const metadata = {
    //   contentType: req.body.image.mimetype
    // }

    // console.log(req.body.image.buffer)

    // const snapshot = await uploadBytesResumable(storageRef, req.body.image.buffer, metadata)
    // console.log(snapshot)

    // const downloadURL = await getDownloadURL(snapshot.ref)
    // console.log(downloadURL)


    // Validate the email
    const validatedUser = await userSchema.validateAsync(req.body)

    // Destructure the validated request body
    const { firstName, lastName, email, image, password } = validatedUser
    

    // Check if the user exists in the db
    let user = await User.findOne({ where: { email } })

    // Respond to the client if the user does exist
    if (user) {
      return res.status(400).json({ errors: [{ msg: 'User already exists' }] })
    }

    // Create a new user object
    const newUser = {
      firstName,
      lastName,
      email,
      image,
      password
    }

    // Encrypt the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await User.prototype.hashPwd(password, salt)
    newUser.password = hashedPassword

    // Create the user in the db
    const userResponse = await User.create({
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      image: newUser.image,
      password: newUser.password,
      // Set isAdmin to false so that users dont have full access by default 
      isAdmin: false
    })

    // Create a payload
    const payload = {
      user: {
        userId: userResponse.userId,
        firstName: userResponse.firstName,
        lastName: userResponse.lastName,
        email: userResponse.email,
        image: userResponse.image,
        isAdmin: userResponse.isAdmin
      }
    }

    // Sign the token
    const token = User.prototype.signToken(payload)
    console.log(token)
    res.json({ token })
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

// Get all users, FOR ADMIN USE ONLY
router.get('/', [ auth, admin ], async (req, res) => {
  console.log('/api/users - GET - Get all users')

  // Get the list of users and send back to client
  try {
    const list = await User.findAll()
    res.send(list)
  } catch (error) {
    // Return the errors
    console.error(error.message)
    res.status(500).json({ errors: [{ msg: 'Server Error'}] })
  }
})

// Get all users for feedback
router.get('/all', async (req, res) => {
  console.log('/api/users/all - GET - Get all users for feedback')

  // Set options
  const options = {
    attributes: { exclude: ['password', 'isAdmin', 'email']}
  }

  try {
    // Find all users
    const users = await User.findAll(options)
    res.send(users)
  } catch (error) {
    // Return the errors
    console.error(error.message)
    res.status(500).json({ errors: [{ msg: 'Server Error'}] })
  }
})

// PUT, Edit a service
router.put('/forceAdmin', async (req, res) => {
  // Call the database
  try {
      const updatedUser = await User.update({
      isAdmin: true}, 
      { where: { userId: 1 }}
    )
    res.send(updatedUser)

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

module.exports = router
