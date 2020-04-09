const jwt = require('jsonwebtoken');
require('dotenv/config');

const expiresIn = process.env.TOKEN_EXPIRES || 1800;
const secrete = process.env.API_KEY;

const generateAuthToken = (id) => jwt.sign({ id }, secrete, { expiresIn });

module.exports = { generateAuthToken };