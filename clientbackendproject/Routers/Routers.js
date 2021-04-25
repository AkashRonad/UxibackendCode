const express = require('express');

const router = express.Router();

const SignupController = require('../Controllers/User');


router.post('/signup',SignupController.register);
router.post('/signin',SignupController.login);
router.get('/user/me',SignupController.userinformation);


module.exports = router;