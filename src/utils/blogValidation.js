// Import joi
const Joi = require('joi');

// Create a schema for validating the user
const blogSchema = Joi.object({
  postId: Joi.number().integer().min(1),
  title: Joi.string().min(3),
  body: Joi.string().min(10)
})

// Export the schema
module.exports = {
  blogSchema
}