const jwt = require('jsonwebtoken');
const { props } = require('./../../config');
const expiresIn = parseInt(props.token_expires);

const generateAuthToken = (id) => jwt.sign({ id }, props.token_secrete, { expiresIn });

module.exports = { generateAuthToken };