// Require express and any required modules
const express = require('express')
const db = require('../models')
const router = express.Router()

// Pull service out of the db
const { Service } = db.sequelize.models

// Import middleware
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')

// Import schema
const { serviceSchema } = require('../utils/serviceValidation')

// GET all services
router.get('/', async (req, res) => {
  // Log the endpoint
  console.log('/api/services - GET ALL')

  // Call the database
  try {
    const services = await Service.findAll()
    // Send the response back to the client
    res.send(services)
  } catch (error) {
    // Return the errors
    console.error(error.message)
    res.status(500).json({ errors: [{ msg: 'Server Error'}] })
  }
})

// GET a single service
router.get('/:id', async (req, res) => {
  // Log the endpoint
  console.log('/api/services/:id - GET ONE')

  // Call the database
  try {
    // Get the id from the request parameters and convert to int
    let serviceId = parseInt(req.params.id)

    // Validate the id
    const validatedId  = await serviceSchema.validateAsync({ serviceId })
    serviceId = validatedId.serviceId

    const service = await Service.findByPk(serviceId)
    // Send the response back to the client
    res.send(service)
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

// POST, Add a service
router.post('/', [ auth, admin ], async (req, res) => {
  // Log the endpoint
  console.log('/api/services - POST')

  // Call the database
  try {
    // Validate the request body
    const validatedBody = await serviceSchema.validateAsync(req.body)

    // Get the service, description and price from the validated body
    const { service, description, price } = validatedBody

    // Create a new service
    const newService = await Service.create({
      service,
      description,
      price
    })
  
    // Log the response from the database
    console.log(newService.toJSON())
  
    // Send the response back to the client
    res.send(newService)
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

// PUT, Edit a service
router.put('/:id', [ auth, admin ], async (req, res) => {
  // Log the endpoint
  console.log('/api/services/:id - PUT')

  
  // Call the database
  try {
    // Get the id from the request parameters and convert to int
    let serviceId = parseInt(req.params.id)
  
    // Get the service, description and price from the request body
    var { service, description, price } = req.body

    var validateService = {
      serviceId,
      service,
      description,
      price
    }

    // Validate the service
    const validatedService = await serviceSchema.validateAsync(validateService)

    // Destructure the validated service
    serviceId = validatedService.serviceId
    service = validatedService.service
    description = validatedService.description
    price = validatedService.price

    const updatedService = await Service.update({
      service,
      description,
      price,}, 
      { where: { serviceId: serviceId }}
    )
  
    // Log the response from the database
    console.log(updatedService)
  
    // Send the response back to the client
    res.send(updatedService)
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

// DELETE, Delete a service
router.delete('/:id', [ auth, admin ], async (req, res) => {
  // Log the endpoint
  console.log('/api/services/:id - DELETE')

  
  // Call the database
  try {
    // Get the id from the request parameters and convert to int
    let serviceId = parseInt(req.params.id)

    // Validate the id
    const validatedId  = await serviceSchema.validateAsync({ serviceId })
    serviceId = validatedId.serviceId

    Service.destroy({ where: { serviceId: serviceId }})
  
    // Send the response back to the client
    res.send(`Deleted service with id of ${serviceId}`)
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