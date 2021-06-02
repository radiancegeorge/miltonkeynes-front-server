const express = require('express');
const fileUpload = require('express-fileupload');

const {
    Registration,
    login,
    index,
    genOtp,
    emailVerification,
    transaction,
    findUserForTransaction,
    passwordReset,
    chanegOldPass,
    messageToAdmin
} = require('../controllers/users');

const protect = require('../middleware/protect.middleware');
const user = express.Router();


user.get('/', protect, index);
user.get('/verifyEmail', emailVerification);
user.get('/generateOTP', protect, genOtp);

user.post('/register', fileUpload(), Registration);
user.post('/login', login);
user.post('/transaction',protect, transaction);
user.post('/findUser', protect, findUserForTransaction);
user.post('/passwordReset', passwordReset);
user.post('/generateOTP', genOtp);
user.post('/changeOldPass', protect, chanegOldPass);
user.post('/mailToAdmin', protect, messageToAdmin);
user.post('/mailToAdmin_2', messageToAdmin);

module.exports = user;