const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const userRouter = require('./app/routes/user');
const index = require('./app/routes/index');

port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', index);

app.use('/user', userRouter);

app.listen(port);
console.log(`starting server on port: ${port}`);

module.exports = app;