const asyncHandler = require('express-async-handler');
const {Users}  = require('../../models');
const bcrypt = require('bcrypt');
const { sign } = require('../../utils/auth');
const generateAccountNumber = require('../../utils/accountGen');
const{v4 : uuid} = require('uuid');
const upload = require('../../utils/fileUpload');
const mailer = require('../../utils/nodeMailer');
const mainUrl = 'http://localhost:4000';
const {Op} = require('sequelize');
const Messages = require('../../models/Messages');
const generateOtp = require('../../utils/genOtp')

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
            html: `<a href="${mainUrl}/email-verification?token=${token}&id=${email}"> click here to confirm your mail</a>`
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
        const {id, email} = user
        const isUSer = await bcrypt.compare(password, user.password);
        if(isUSer){
            const token = sign({id, email});
            res.status(200).send({token})
        }else{
            res.status(403);
        }
    }else{
        res.status(401).send();
    }
});
const emailVerification = asyncHandler(async(req, res, next)=>{
    const {token, email} = req.query;
    const user = await Users.findOne({
        where:{
           [Op.and]:{
               token, email
           } 
        }
    });
    if(user){
        //render a successful mail verification page
    }else{
        res.status(404).send();
    }

});

const genOtp = asyncHandler(async(req, res, next)=>{
    const otp = generateOtp();
    res.status(200).send({otp})
})

const transaction = asyncHandler(async (req, res, next) => {
    const {id, email} = req.user;
    const {amount, receiverId} = req.body;
    const userBalance = (await Users.findOne({
        where: {
            id
        }
    })).balance;
    const receiverBalance = (await Users.findOne({
        where: {
            id: receiverId
        }
    })).balance;
    if(Number(userBalance) < Number(amount)){
        res.status(200).send({err: 'insufficient balance'})
    }else{
        const newUserBalance = Number(userBalance) - Number(amount);
        const newReceiverBalance = Number(receiverBalance) + Number(amount);
        const debit = {
            message: `Your account has been debited with £${amount}`,
            type: 'debit',
            header: 'DEBIT'
        };
       const credit = {
           message: `Your account has been credited with £${amount}`,
           type: 'credit',
           header: 'CREDIT'
       }
       Users.update({
           balance: newUserBalance
       }, {
           where: {
               id
           }
       })
       Users.update({
           balance: newReceiverBalance
       }, {
           where: {
               id: receiverId
           }
       });
       Messages.bulkCreate([
           debit, credit
       ]);
       res.status(200).send();
    }
})

const index = asyncHandler(async (req, res, next)=>{
    const {id} = req.user;
    const notifications = await Messages.findAll({
        where: {
            user_id: id
        }
    });
    const user = await Users.findOne({
        where: {
            id
        }
    });
    res.status(200).send({user, notifications})
})

module.exports = {
    Registration, login, emailVerification, transaction, index, genOtp
}