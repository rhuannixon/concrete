var express = require('express');
var router = express.Router();
const settings = require('../../package.json');

router.get('/', (req, res, next) => {
    res.status(200).send(settings.version);
});

module.exports = router;