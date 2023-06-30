// Import Joi
const Joi = require('joi');

// Create a schema for validating the user
const userSchema = Joi.object({
  userId: Joi.number().integer().min(1),
  firstName: Joi.string().min(3),
  lastName: Joi.string().min(3),
  image: Joi.string().min(3),
  email: Joi.string().email().min(3),
  password: Joi.string().min(3),
})

// Export the schema
module.exports = {
  userSchema
}