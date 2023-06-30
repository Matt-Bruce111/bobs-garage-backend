// Import Joi
const Joi = require('joi');

// Create a schema for validating the user
const serviceSchema = Joi.object({
  serviceId: Joi.number().integer().min(1),
  service: Joi.string().min(3),
  description: Joi.string().min(3),
  price: Joi.number().integer().min(1)
})

// Export the schema
module.exports = {
  serviceSchema
}