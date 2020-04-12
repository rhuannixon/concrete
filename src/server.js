const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const routes = require('./routes');
const cors = require('cors');
const helmet = require('helmet');
const { autheticate } = require("./middleware/session");
autheticate.unless = require("express-unless");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const logger = require("morgan");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(logger('dev'));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/', (req, res) => res.redirect('/docs'));
app.use(
    autheticate.unless({
        path: [
            { url: "/signin", methods: ["POST"] },
            { url: "/signup", methods: ["POST"] }
        ]
    })
);
app.use(routes);

module.exports = app;