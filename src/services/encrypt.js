const bcrypt = require("bcrypt");

const generateHash = password => bcrypt.hash(password, bcrypt.genSaltSync(8));

const validPassword = (passed, existing) => bcrypt.compareSync(passed, existing);

module.exports = {
    generateHash, validPassword
}