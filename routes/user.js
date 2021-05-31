const express = require('express');
const fileUpload = require('express-fileupload');
const { Registration, login, index, genOtp, emailVerification, transaction, findUserForTransaction, passwordReset } = require('../controllers/users');
const protect = require('../middleware/protect.middleware')
const user = express.Router();


user.get('/', protect, index);
user.get('/verifyEmail', emailVerification);


user.post('/register', fileUpload(), Registration);
user.post('/login', login);
user.post('/generateOTP', genOtp);
user.post('/transaction',protect, transaction);
user.post('/findUser', protect, findUserForTransaction);
user.post('/passwordReset', protect, passwordReset);

module.exports = user;