const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const {User} = require('./models/index');
const encrypt = require('./util/encrypt');
const auth = require('./util/auth');
require('dotenv/config');
const mysql = require('mysql2');
const config = require('../config/config.json')

port = process.env.port || 3000;
/*console.log('connecting on database.')
const conn = mysql.createConnection({
    "user": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": "database_development",
    "host": "127.0.0.1",
    "dialect": "mysql"
})
conn.connect(err => {
  !err ? console.log('connection success!') : console.log(`Failed to connect: ${err}`)
})*/

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('version 1.0.0');
});

app.post('/signup',  (req,res) => {
    newUser = req.body;
    User.create(newUser)
    .then(async user => {
      token = await auth.generateAuthToken(user.id);
        user.token = token;
        user.save();
        res.setHeader('Bearer',token);
      res.status(201).json(user);
    })
    .catch(err => res.status(500).json(err));
});

app.post('/signin',(req,res) => {
  User.findOne({
    where: {
      email:req.body.email
    }
  }).then(async user => {
    if(user){
      isValid = await encrypt.validPassword(req.body.password,user.password);
      if(isValid){
        token = await auth.generateAuthToken(user.id);
        user.token = token;
        user.save();
        res.setHeader('Bearer',token);
        return res.status(200).json(user);
      }
    }
    return res.status(401).json("Usuário e/ou senha inválidos")
  }).catch(err => res.status(500).json(err));
});

app.get('/search/:id', (req,res) => {
  
  var token = req.headers['bearer'];
  if (!token) return res.status(401).send('Não autorizado');

  auth.verify(req,res,token)

  User.findOne({
    where: {
      id:req.params.id
    },
    include:  ['Telefones']
})
  .then(user => res.status(200).send(user))
  .catch(err => res.status(500).send({error:err}));
});

app.listen(port);
console.log('starting server...');