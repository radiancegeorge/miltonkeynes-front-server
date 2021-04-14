const express = require('express');
const fileUpload = require('express-fileupload');
const { Registration, login } = require('../controllers/users');
const user = express.Router();

user.post('/register', fileUpload(), Registration);
user.post('/login', login);

module.exports = user;