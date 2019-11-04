const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const {User} = require('./models/index');
const encrypt = require('./util/encrypt')

port = process.env.port || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('version 1.0.0');
});

app.post('/signup', (req,res) => {
    newUser = req.body;
    User.create(newUser)
    .then(user => res.status(201).json(user))
    .catch(err => res.status(500).json(err));
});

app.post('/signin',(req,res) => {
  User.findAll({
    where: {
      email:req.body.email
    }
  }).then(async user => {

    if(user[0]){
      valid = await encrypt.validPassword(req.body.password,user[0].password);
      console.log(valid);
      if(valid){
        return res.status(200).json(user[0]);
      }
    }
    return res.status(401).json("Usuário e/ou senha inválidos")
  }).catch(err => res.status(500).json(err));
});

app.get('/search', (req,res) => {
  console.log("searching for users...");
  User.findAll({
    include:  ['Telefones']
})
  .then(user => res.send({user}))
  .catch(err => res.send({error:err}));
});

app.listen(port);
console.log(`starting server on port: ${port}`);