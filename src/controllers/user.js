const { generateAuthToken } = require('../services/auth');
const encrypt = require('../services/encrypt');
const { User, Telefone } = require('../models/index');
const { sendMail } = require('../services/mailer');
const crypto = require('crypto');
const { props } = require('./../../config');

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

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } })
        if (!user) return res.status(400).json("User not found");

        const code = crypto.randomBytes(4).toString('HEX');

        const dataExpires = new Date().getTime() + parseInt(props.passwordResetExpires);
        user.passwordResetExpires = dataExpires;
        user.passwordResetToken = code;
        await user.save();

        sendMail(user.email, code);

        return res.status(200).json('Recovery email was sent');
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

const changePassword = async (req, res) => {
    try {
        const { email, code, newPassword, confirmPassword } = req.body;
        if (confirmPassword !== newPassword)
            return res.status(400).json('new passord and confirm password are different');

        const user = await User.findOne({ where: { email } })

        if (!user) return res.status(400).json("User not found");
        const dateExists = new Date(user.passwordResetExpires).getTime();
        if (Date.now() > dateExists)
            return res.status(400).json("Code reset expired. require new code");

        if (code !== user.passwordResetToken)
            return res.status(400).json("Password reset token is invalid");

        const password = await encrypt.generateHash(newPassword);
        user.password = password;
        await user.save();

        return res.status(200).json("Password changed successfully");
    } catch (error) {
        res.status(500).json(error.message);
    }
}

module.exports = {
    signup,
    signin,
    search,
    forgotPassword,
    changePassword
};