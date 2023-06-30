// Import joi
const Joi = require('joi');

// Create a schema for validating the user
const authSchema = Joi.object({
  userId: Joi.number().integer().min(1),
  email: Joi.string().email(),
  password: Joi.string().min(6),
  firstName: Joi.string().min(1),
  lastName: Joi.string().min(1),
  image: Joi.string().min(1),
  isAdmin: Joi.boolean()
})

// Export the schema
module.exports = {
  authSchema
}