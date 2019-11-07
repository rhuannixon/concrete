var express = require('express');
var router = express.Router();
const auth = require('../util/auth');
const encrypt = require('../util/encrypt');
const { User, Telefone } = require('../models/index');

router.post('/signup', async (req, res, next) => {
    try{
        const newUser = await User.create(req.body);    
        token = await auth.generateAuthToken(newUser.id);
        newUser.token = token;
        
        for(var i = 0;i<req.body.telefones.length;i++)
        {
            var {numero,ddd} = req.body.telefones[i];
            console.log(`${numero}: ${ddd}`);
            await Telefone.create({
                "numero":numero,
                "ddd":ddd,
                "userId":newUser.id})
                .catch(err => console.log(err));
        }
        newUser.save();
        res.setHeader('Bearer', token);
        res.status(201).json(newUser);
    }catch(err){
        res.status(500).send(err);
    }
});

router.post('/signin', async (req, res, next) => {
    try{
        user = await User.findOne({email: req.body.email});
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
        return res.status(401).json("Usuário e/ou senha inválidos");
    }catch(err){
        console.log(err);
        res.status(500).send(err);
    }
});

router.get('/search/:id', async (req, res, next) => {
    try{
        var token = req.headers.bearer;
        if (!token) return res.status(401).send('Não autorizado');

        auth.verify(req, res, token);

        user = await User.findOne({
                where: {
                    id: req.params.id
                },
                include: ['Telefones']
                });
        if(!user){
            res.status(404).send('Usuário não encontrado.')
        }

        res.status(200).send(user);
    }catch(err){
        console.log(err);
        res.status(500).send(err);
    }
});

module.exports = router;