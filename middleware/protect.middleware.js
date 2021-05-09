const asyncHandler =  require('express-async-handler');
const jwt = require('jsonwebtoken');
const { verify } = require('../utils/auth');

const protect = asyncHandler((req, res, next)=>{
    console.log('attempting login')
    const {authorization} = req.headers;
    if(authorization){
        const token = authorization.split(' ')[1];
        const verification = verify(token);
        console.log(verification)
        req.user = verification;
        next()
    }else{
        res.status(401).send()
    }
});

module.exports = protect