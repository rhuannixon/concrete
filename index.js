const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const {User,Telefone} = require('./app/models/index');
const encrypt = require('./app/util/encrypt');
const auth = require('./app/util/auth');
const mysql = require('mysql2');
const config = require('./config/config.json')

port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('version 1.0.0');
});

//---------------------signup------------------------\\
app.post('/signup',  (req,res) => {
    newUser = req.body;
    User.create(newUser)
    .then(async user => {
      token = await auth.generateAuthToken(user.id);
        user.token = token;
        for(var i = 0;i < newUser.telefones.length;i++){
          Telefone.create(newUser.telefones[i])
          .catch(err => res.status(500).send(err));
        }
        user.save();
        res.setHeader('Bearer',token);
      res.status(201).json(user);
    })
    .catch(err => res.status(500).send(err));
});


//---------------------signin------------------------\\
app.post('/signin',(req,res) => {
  User.findOne({
    where: {
      email:req.body.email
    }
  }).then(async user => {
    if(user){
      isValid = encrypt.validPassword(req.body.password,user.password);
      if(isValid){
        token = await auth.generateAuthToken(user.id);
        user.token = token;
        user.save();
        res.setHeader('Bearer',token);
        return res.status(200).json(user);
      }
    }
    return res.status(401).json("Usuário e/ou senha inválidos")
  }).catch(err => res.status(500).send(err));
});


//---------------------search------------------------\\
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
console.log(`starting server on port: ${port}`);