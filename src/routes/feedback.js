// Require express and any required modules
const express = require('express')
const db = require('../models')
const router = express.Router()

// Pull service out of the db
const { Feedback } = db.sequelize.models

// Import middleware
const auth = require('../middleware/auth')

// Import schema
const { feedbackSchema } = require('../utils/feedbackValidation')

// GET - Get all feedback
router.get('/', async (req, res) => {
  // Log the endpoint
  console.log('/api/feedback - GET ALL')

  // Call the database
  try {
    const feedback = await Feedback.findAll()
    // Send the response back to the client
    res.send(feedback)
  } catch (error) {
    // Return the errors
    console.error(error.message)
    res.status(500).json({ errors: [{ msg: 'Server Error'}] })
  }
})

// GET - Get a single feedback
router.get('/:id', async (req, res) => {
  // Log the endpoint
  console.log('/api/feedback/:id - GET SINGLE')

  
  // Call the database
  try {
    // Get the id from the request parameters and convert to int
    let feedbackId = parseInt(req.params.id)

    // Validate the id
    const validatedId = await feedbackSchema.validateAsync({ feedbackId })
    feedbackId = validatedId.feedbackId

    // Find the feedback
    const feedback = await Feedback.findByPk(feedbackId)
    // Send the response back to the client
    res.send(feedback)
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

// POST - Add feedback
router.post('/', async (req, res) => {
  // Log the endpoint
  console.log('/api/feedback - POST')

  // Call the database
  try {
    // Validate the request body
    const validatedBody = await feedbackSchema.validateAsync(req.body)

    // Get the body out of the validated request body
    const { body, UserUserId } = validatedBody

    const newFeedback = await Feedback.create({
      body,
      UserUserId
    })
  
    // Log the response from the database
    console.log(newFeedback.toJSON())
  
    // Send the response back to the client
    res.send(newFeedback)
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

// PUT - Update feedback
router.put('/:id', async (req, res) => {
  // Log the endpoint
  console.log('/api/feedback/:id - PUT')

  // Update the feedback in the db
  try {
    // Get the id from the request parameters and convert to int
    let feedbackId = parseInt(req.params.id)

    // Desctructure the request body
    var { body, UserUserId } = req.body

    var validateFeedback = {
      feedbackId: feedbackId,
      body,
      UserUserId
    }

    // Validate the new feedback
    const validatedFeedback  = await feedbackSchema.validateAsync(validateFeedback)
    console.log(validateFeedback)

    // Desctructure the validated body
    feedbackId = validatedFeedback.feedbackId
    body = validatedFeedback.body
    UserUserId = validatedFeedback.UserUserId

    // Update the feedback
    const updatedFeedback = await Feedback.update({
      body,
      UserUserId},
      { where: { feedbackId: feedbackId }}
    )
  
    // Log the response from the db
    console.log(updatedFeedback)
  
    // Send a response to the client
    res.send(`Item: ${updatedFeedback} has been updated`)
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

// DELETE - Delete feedback
router.delete('/:id', async (req, res) => {
  // Log the endpoint
  console.log('/api/feedback/:id - DELETE FEEDBACK')

  
  // Call the database
  try {
    // Get the id from the request parameters and convert to int
    let feedbackId = parseInt(req.params.id)

    // Validate the id
    const validatedId = await feedbackSchema.validateAsync({ feedbackId })
    feedbackId = validatedId.feedbackId

    Feedback.destroy({ where: { feedbackId: feedbackId}})
    res.send(`Id: ${feedbackId} has been deleted`)
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
module.exports = router