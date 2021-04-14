require('dotenv').config();
const jwt = require('jsonwebtoken');




const sign = (objectToSign) => {
    const token = jwt.sign(objectToSign, process.env.secret);
    return token
}


const verify = (token) => {
    const data = jwt.verify(token, process.env.secret);
    return data
}


module.exports  = {
    sign, verify
}