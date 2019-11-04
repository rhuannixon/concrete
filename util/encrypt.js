const bcrypt = require("bcrypt");

exports.generateHash = function(password){
    return bcrypt.hash(password, bcrypt.genSaltSync(8));
}


exports.validPassword = function(passed,existing){
    return bcrypt.compare(passed, existing);
}