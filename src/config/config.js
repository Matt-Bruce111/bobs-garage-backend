// Import our dotenv variables
require('dotenv').config()

module.exports = {
  // Set our port to server
  port: process.env.PORT,
  db: {
    // Db credentials
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    options: {
      dialect: process.env.DIALECT,
      host: process.env.HOST,
      storage: './bobsGarage.sqlite'
    }
  },
  auth: {
    jwtsecret: process.env.JWT_SECRET
  }
}