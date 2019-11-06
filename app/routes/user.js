var express = require('express');
var router = express.Router();
const auth = require('./../util/auth');
const encrypt = require('../util/encrypt');
const { User, Telefone } = require('../models/index');

router.post('/signup', (req, res, next) => {
    newUser = req.body;
    User.create(newUser)
        .then(async user => {
            token = await auth.generateAuthToken(user.id);
            user.token = token;

            user.save();
            res.setHeader('Bearer', token);
            res.status(201).json(user);
        })
        .catch(err => res.status(500).send(err));
});

router.post('/signin', (req, res, next) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(async user => {
        if (user) {
            isValid = encrypt.validPassword(req.body.password, user.password);
            if (isValid) {
                token = await auth.generateAuthToken(user.id);
                user.token = token;
                user.save();
                res.setHeader('Bearer', token);
                return res.status(200).json(user);
            }
        }
        return res.status(401).json("Usuário e/ou senha inválidos")
    }).catch(err => res.status(500).send(err));
});

router.get('/search/:id', (req, res, next) => {
    var token = req.headers['bearer'];
    if (!token) return res.status(401).send('Não autorizado');

    auth.verify(req, res, token)

    User.findOne({
            where: {
                id: req.params.id
            },
            include: ['Telefones']
        })
        .then(user => res.status(200).send(user))
        .catch(err => res.status(500).send({ error: err }));
});

module.exports = router;