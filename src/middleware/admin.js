// Admin middleware secure routes only accessible for administrators

// Create Admin middleware
function admin(req, res, next) {
  // Check if the user is an admin
  console.log(req.user)
  if (!req.user.isAdmin) {
    return res.status(403).send('Access denied.')
  }

  // If the user is an admin, continue
  next()
}

module.exports = admin