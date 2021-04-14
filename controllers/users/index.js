const asyncHandler = require('express-async-handler');
const {Users}  = require('../../models');
const bcrypt = require('bcrypt');
const { sign } = require('../../utils/auth');
const generateAccountNumber = require('../../utils/accountGen');
const{v4 : uuid} = require('uuid');
const upload = require('../../utils/fileUpload');
const mailer = require('../../utils/nodeMailer');
const mainUrl = 'http://localhost:4000'

const Registration  = asyncHandler(async(req, res, next)=>{
    const data = req.body;
    const {files} = req;
    const {email} = data;
    const user = await Users.findOne({
        where: {
            email
        }
    });
    if(!user){
        const password = await bcrypt.hash(data.password, 10);
        const accountNumber = await generateAccountNumber(10);
        const token = uuid();
        const fileNames = await upload(files);
        const dbData = {...data, password, accountNumber, token, imageName: fileNames};
        Users.create(dbData);
        //send mail
        mailer({
            to: email,
            html: `<a href="${mainUrl}/${token}"> click here to confirm your mail</a>`
        })
        res.status(200).send(dbData);
    }else{
        res.status(200).send({
            err: 'User already exists'
        })
    }
});

const login = asyncHandler(async(req, res, next)=>{
    const {email, password} = req.body;

    const user = await Users.findOne({
        where: {
            email
        }
    });
    if(user){
        const isUSer = await bcrypt.compare(password, user.password);
        if(isUSer){
            const token = sign(user);
            res.status(200).send({token})
        }else{
            res.status(403);
        }
    }else{
        res.status(401).send();
    }
});


module.exports = {
    Registration, login
}