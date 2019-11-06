const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const version = require('./package.json')
const userRouter = require('./app/routes/user');

port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send(`version ${version.version}`);
});

app.use('/user', userRouter);

app.listen(port);
console.log(`starting server on port: ${port}`);