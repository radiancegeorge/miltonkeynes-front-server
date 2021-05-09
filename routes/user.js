const express = require('express');
const fileUpload = require('express-fileupload');
const { Registration, login, index } = require('../controllers/users');
const protect = require('../middleware/protect.middleware')
const user = express.Router();


user.post('/', protect, index);
user.post('/register', fileUpload(), Registration);
user.post('/login', login);

module.exports = user;