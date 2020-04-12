const jwt = require("jsonwebtoken");
const { props } = require('./../../config');
exports.autheticate = (req, res, next) => {
    const token = req.headers.authentication.replace('Bearer ', '');
    jwt.verify(token, props.token_secrete, function (err, decoded) {
        if (err)
            return res.status(401).send({
                message: "Não autorizado / Sessão expirada",
            });
        next();
    });
};
