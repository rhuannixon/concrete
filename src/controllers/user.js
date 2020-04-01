const auth = require('../util/auth');
const encrypt = require('../util/encrypt');
const { User, Telefone } = require('../models/index');

const signup = async (req, res) => {
    try {
        const user = await User.create(req.body);
        token = await auth.generateAuthToken(user.id);
        user.token = token;

        for (var i = 0; i < req.body.telefones.length; i++) {
            var { numero, ddd } = req.body.telefones[i];
            console.log(`${numero}: ${ddd}`);
            await Telefone.create({
                "numero": numero,
                "ddd": ddd,
                "userId": user.id
            })
                .catch(err => console.log(err));
        }
        user.save();
        res.setHeader('Authentication', `Bearer ${token}`);
        user.password = undefined;
        return res.status(201).json(user);
    } catch (err) {
        return res.status(500).send(err);
    }
};

const signin = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            isValid = encrypt.validPassword(req.body.password, user.password);
            if (isValid) {
                token = await auth.generateAuthToken(user.id);
                user.token = token;
                user.save();
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

        return res.status(200).send(user);
    } catch (err) {
        console.log(err);
        return res.status(500).send(err.message);
    }
};

module.exports = {
    signup, signin, search
};