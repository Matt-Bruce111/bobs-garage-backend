// Import Joi
const Joi = require('joi');

const feedbackSchema = Joi.object({
  feedbackId: Joi.number().integer().min(1),
  body: Joi.string().min(3),
  UserUserId: Joi.number().integer().min(1)
})

module.exports = {
  feedbackSchema
}