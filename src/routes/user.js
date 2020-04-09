const express = require('express');
const router = express.Router();
const { user } = require('../controllers');

router.post('/signup', user.signup);

router.post('/signin', user.signin);

router.get('/user/search/:id', user.search);

module.exports = router;