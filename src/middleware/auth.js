// Import jwt and config.
const jwt = require('jsonwebtoken');
const config = require('../config/config');

// Create the auth middleware
module.exports = function(req, res, next) {
  // Get the token from the request header
  const token = req.header('x-auth-token')
  console.log(token)

  // Check if we have a token or not
  if(!token){
    // If a token isnt found, notify the user
    return res.status(401).json({ msg: 'No token, Authorisation denied.' });
  }

  // Verify the token.
  try {
    const decoded = jwt.verify(token, config.auth.jwtsecret);
    req.user = decoded.user;

    // Call the next piece of middleware.
    next();
  } catch (error) {
    // Catch any errors.
    res.status(401).json({ msg: 'Token is not valid'});
  }
}