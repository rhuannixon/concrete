const jwt = require('jsonwebtoken');
require('dotenv/config');

exports.generateAuthToken = async function(userId) {
    //expiresIn:1800 = 30min
    return jwt.sign({id: userId}, process.env.API_KEY, {expiresIn: 1800});
}

exports.verify = async function(req,res,token) {
    jwt.verify(token, process.env.API_KEY, function(err, decoded) {
        console.log(err)
        if (err) return res.status(401).send('Não autorizado.');
    })
}