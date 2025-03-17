// Import our dotenv variables
//require('dotenv').config()

PORT='3500'

DB_NAME='bobsGarage'
DB_USER='root'
DB_PASS='root'
DIALECT='sqlite'
HOST='http://147.93.31.192/'
JWT_SECRET="HelloiamAsecret"

module.exports = {
  // Set our port to server
  port: PORT,
  db: {
    // Db credentials
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASS,
    options: {
      dialect: DIALECT,
      host: HOST,
      storage: '../src/bobsGarage.sqlite'
    }
  },
  auth: {
    jwtsecret: JWT_SECRET
  }
}
