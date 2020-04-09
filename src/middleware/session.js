const jwt = require("jsonwebtoken");
require("dotenv/config");

exports.autheticate = (req, res, next) => {
    const token = req.headers.authentication.replace('Bearer ', '');
    jwt.verify(token, process.env.API_KEY, function (err, decoded) {
        if (err)
            return res.status(401).send({
                message: "Não autorizado / Sessão expirada",
            });
        next();
    });
};
