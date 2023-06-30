// Import sequelize
const { Sequelize, DataTypes } = require('sequelize')

// Import jsonwebtoken and bcrypt
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Import config file
const config = require('../config/config')

// Init db variable
let db = {}

// Create new sequelize instance
const sequelize = new Sequelize(
  config.db.database,
  config.db.user,
  config.db.password,
  config.db.options 
);

// Create Services Model
const Service = sequelize.define('Service', {
  // Model attributes are defined here
  serviceId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  service: { type: DataTypes.STRING },
  description: { type: DataTypes.STRING },
  price: { type: DataTypes.INTEGER },
})

// Create User Model
const User = sequelize.define('User', {
  // Primary key
  userId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  firstName: { type: DataTypes.STRING },
  lastName: { type: DataTypes.STRING },
  // Email must be unique
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  image: { type: DataTypes.STRING },
  isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false }
})

// Create Feedback Model
const Feedback = sequelize.define('Feedback', {
  feedbackId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  body: { type: DataTypes.STRING }
  // No need to create foreign key here, this will be done later
})

// Create Post Model
const Post = sequelize.define('Post', {
  postId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING },
  body: { type: DataTypes.STRING }
})

// Create the relationship between User and Feedback tables
User.hasOne(Feedback)
Feedback.belongsTo(User)

// Log the models
console.log(sequelize.models)

// Store the signToken function in the user model
User.prototype.signToken = function(payload){
  console.log('Signing Token');
  console.log(payload);
  // Sign the token.
  const token =  jwt.sign(payload, config.auth.jwtsecret, 
    { expiresIn: "7d",
      algorithm: "HS512"});
  return token;
}

// Store the hashPwd function in the user model
User.prototype.hashPwd = async function(password, salt){
  console.log('Hashing password');
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

// Init access variables
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Export db
module.exports = db;
module.exports.Op = Sequelize.Op