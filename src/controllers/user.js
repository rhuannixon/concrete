const { generateAuthToken } = require('../services/auth');
const encrypt = require('../services/encrypt');
const { User, Telefone } = require('../models/index');

const signup = async (req, res) => {
    try {
        const user = await User.create(req.body);

        for (var i = 0; i < req.body.telefones.length; i++) {
            var { numero, ddd } = req.body.telefones[i];
            await Telefone.create({
                "numero": numero,
                "ddd": ddd,
                "userId": user.id
            })
                .catch(err => console.log(err));
        }
        user.password = undefined;
        return res.status(201).json(user);
    } catch (err) {
        console.log(err)
        return res.status(500).json(err);
    }
};

const signin = async (req, res) => {
    try {
        const user = await User.findOne({ where: { email: req.body.email } });
        if (user) {
            isValid = encrypt.validPassword(req.body.password, user.password);
            if (isValid) {
                token = generateAuthToken(user.id);
                user.password = undefined;
                res.setHeader('Authentication', `Bearer ${token}`);
                return res.status(200).json(user);
            }
        }
        return res.status(401).json("Usuário e/ou senha inválidos");
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

const search = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                id: req.params.id
            },
            include: ['Telefones']
        });
        if (!user) {
            res.status(404).send('Usuário não encontrado.')
        }
        user.password = undefined;
        return res.status(200).send(user);
    } catch (err) {
        console.log(err);
        return res.status(500).send(err.message);
    }
};

module.exports = {
    signup, signin, search
};