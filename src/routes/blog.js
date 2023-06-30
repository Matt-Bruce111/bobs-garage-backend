// Require express and any required modules
const express = require('express')
const db = require('../models')
const router = express.Router()

// Pull service out of the db
const { Post } = db.sequelize.models

// Import middleware
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')

// Import schema
const { blogSchema } = require('../utils/blogValidation')

// GET - Get all blog posts
router.get('/', async (req, res) => {
  // Log the endpoint
  console.log('/api/blog - GET ALL')

  // Call the database
  try {
    const blog = await Post.findAll()
    // Send the response back to the client
    res.send(blog)
  } catch (error) {
    // Return the errors
    console.error(error.message)
    res.status(500).json({ errors: [{ msg: 'Server Error'}] })
  }
})

// GET - Get a single blog post
router.get('/:id', async (req, res) => {
  // Log the endpoint
  console.log('/api/blog/:id - GET ONE')

  // Call the database
  try {
    // Get the id from the request parameters and convert to int
    let postId = parseInt(req.params.id)

    // Validate the id
    const validated  = await blogSchema.validateAsync({ postId })
    postId = validated.postId

    const blogPost = await Post.findByPk(postId)
    // Send the response back to the client
    res.send(blogPost)
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

// POST, Add a blog post
router.post('/', [ auth, admin ], async (req, res) => {
  // Log the endpoint
  console.log('/api/blog - POST')

  // Call the database
  try {
    // Validate the request body
    const validated  = await blogSchema.validateAsync(req.body)
    console.log(validated)

    // Get the title and body from the validated body
    const { title, body } = validated

    const newPost = await Post.create({
      title,
      body
    })
  
    // Log the response from the database
    console.log(newPost.toJSON())
  
    // Send the response back to the client
    res.send(newPost)
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

// PUT, Edit a post
router.put('/:id', [ auth, admin ], async (req, res) => {
  // Log the endpoint
  console.log('/api/blog/:id - PUT')

  // Call the database
  try {
    // Get the id from the request parameters and convert to int
    let postId = parseInt(req.params.id)

    // Desctructure the request body
    var { title, body } = req.body

    const validatePost = {
      postId,
      title,
      body
    }

    // Validate the request body
    const validated  = await blogSchema.validateAsync(validatePost)

    // Desctructure the validated body
    postId = validated.postId
    title = validated.title
    body = validated.body

    // Update the post
    const updatedPost = await Post.update({
      title,
      body}, 
      { where: { postId: postId }}
    )
  
    // Log the response from the database
    console.log(updatedPost)
  
    // Send the response back to the client
    res.send(updatedPost)
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

// DELETE, Delete a blog post
router.delete('/:id', [ auth, admin ], async (req, res) => {
  // Call the database
  try {
    // Log the endpoint
    console.log('/api/blog/:id - DELETE')
  
    // Get the id from the request parameters and convert to int
    let postId = parseInt(req.params.id)

    // Validate the id
    const validated  = await blogSchema.validateAsync({ postId })

    postId = validated.postId

    Post.destroy({ where: { postId: postId }})
  
    // Send the response back to the client
    res.send(`Deleted blog post with id of ${postId}`)
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