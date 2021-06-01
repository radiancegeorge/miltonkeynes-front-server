const asyncHandler = require('express-async-handler');
const {User: Users, messages: Messages}  = require('../../models');
const bcrypt = require('bcrypt');
const { sign } = require('../../utils/auth');
const generateAccountNumber = require('../../utils/accountGen');
const{v4 : uuid} = require('uuid');
const upload = require('../../utils/fileUpload');
const mailer = require('../../utils/nodeMailer');
const mainUrl = 'http://localhost:4000';
const {Op} = require('sequelize');
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
    console.log(user)
    if(!user){
        try{
            const password = await bcrypt.hash(data.password, 10);
            const accountNumber = await generateAccountNumber(10);
            const token = uuid();
            const fileNames = await upload(files);
            const dbData = {...data, password, accountNumber, token, imageName: fileNames};
            try{
                Users.create(dbData);
            }catch(err){
                res.send({err: "same data"})
            }
            //send mail
            const response = await mailer({
                to: email,
                subject: 'Email Verification',
                html: `
                
                <div style="
                margin: 0;
                padding: 0;
                font-family: -apple-system, Roboto, sans-serif;
            ">
            <div style="
                width: 100%;
                height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
            ">
                <div style="
                    max-width: 400px;
                    padding: 10px 30px;
                ">
                    <p>
                        You've successfully created an account with Milton Keynes Bank.
                        Click below to verify account.
                    </p>
                    <a style="
                        background-color: #7001fa;
                        color: white;
                        padding: 10px 15px;
                        border: none;
                        display: inline-block;
                        outline: none;
                        border-radius: 5px;
                        margin-top: 10px;
                        margin-bottom: 20px;
                        text-decoration: none;
                    " href="${mainUrl}/user/verifyEmail?token=${token}&email=${email}">
                        Verify Account
                    </a>
                    <p style="
                        font-size: 10px;
                    ">
                        Please ignore this email if you did not sign up to milton keynes bank.
                    </p>
                </div>
                </div>
            </div>`
                });
                if(response){
                    res.status(200).send(dbData);
                }else{
                    res.status(500).send()
                }
        }catch(err){
            console.log(err)
        }
    }else{
        res.status(409).send('User already exists')
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
        const {id, email, password: userPassword, active, emailVerification} = user;
        const isUSer = await bcrypt.compare(password, userPassword);
        console.log(isUSer)
        if(isUSer){
            if(emailVerification === true){
                if(active === true){
                    
                    const token = sign({id, email});
                    res.status(200).send({token});
                }else{
                    res.status(200).send({err: "account not active"})
                }

            }else{
                res.status(200).send({err: "Email not verified"});
                // console.log(token);
            }
            
        }else{
            res.status(200).send({error: 'invalid password'});
        }
    }else{
        res.status(401).send('no such user');
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
        //render a successful mail verification page;
        const {id} = user;
        Users.update({
            emailVerification: true, active: true
        }, {where: {
            id
        }});
        Users.update({
            token: null,
        }, {where: {
            id
        }})
        res.render("emailVerification");
        console.log('should have rendered')
    }else{
        res.status(404).send();
    }

});

const genOtp = asyncHandler(async(req, res, next)=>{
    const {email} = req.user || req.body
    const otp = generateOtp(6);
    const response = await mailer({
        to: email,
        subject: 'OTP',
        html: `
        <body style="
        margin: 0;
        padding: 0;
        font-family: -apple-system, Roboto, sans-serif;
    ">
    <div style="
        width: 100%;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
    ">
        <div style="
            max-width: 400px;
            padding: 10px 30px;
        ">
            <p>
                You've successfully initiated a transaction, confirm with the OTP (one-time password) below.
            </p>
            <a style="
                background-color: #7001fa;
                color: white;
                padding: 10px 15px;
                border: none;
                display: inline-block;
                outline: none;
                border-radius: 5px;
                margin-top: 10px;
                margin-bottom: 20px;
                text-decoration: none;
            ">
                ${otp}
            </a>
            <p style="
                font-size: 10px;
            ">
                Please contact customer support if you did not initiate this transaction.
            </p>
        </div>
    </div>
</body> `,

    })
    if(response){
        res.status(200).send({otp})
    }else{
        res.status(500).send('An error with mailing otp')
    }
})

const findUserForTransaction = asyncHandler(async(req, res, next) => {
    const {accountNumber} = req.body;
    const user = await Users.findOne({
        where: {
            accountNumber
        }
    });
    if(user){
        const {id, accountNumber, fullName} = user
        res.status(200).send({id, accountNumber, fullName})
    }else{
        res.status(404).send('no such user');
    }
})

const transaction = asyncHandler(async (req, res, next) => {
    const {id} = req.user;
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
            header: 'DEBIT',
            user_id: id,
            amount
        };
       const credit = {
           message: `Your account has been credited with £${amount}`,
           type: 'credit',
           header: 'CREDIT',
           receiver_id: receiverId,
           amount
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
            [Op.or]:{
                user_id: id, receiver_id: id
            }
            
        }
    });
    const user = await Users.findOne({
        where: {
            id
        }
    });
    res.status(200).send({user, notifications})
});


const passwordReset = asyncHandler(async (req, res, next)=>{

    const {password, email} = req.body;
    const hashedPassword = await  bcrypt.hash(password, 10);

    const updatePassword = await Users.update({
        password: hashedPassword
    }, {
        where:{
            email
        }
    });

    res.status(200).send("password updated")
});

const chanegOldPass = asyncHandler(async (req, res, next)=>{
    const {id} = req.user;
    const {oldPassword, newPassword} = req.body;

    const {password} = await Users.findOne({
        where:{
            id
        }
    });
    const isPassword = await bcrypt.compare(oldPassword, password);
    if(isPassword){
        const newEncryptedPassword = await bcrypt.hash(newPassword, 10);
        try{
            Users.update({
                password: newEncryptedPassword
            }, {
                where: {
                    id
                }
            });
            res.status(200).send('successfully changed password');
        }catch(err){
            res.status(500).send()
        }
    }else{
        res.status(200).send({err: "incorrect password"})
    }
})

module.exports = {
    Registration,
    login,
    emailVerification,
    transaction,
    index,
    genOtp,
    findUserForTransaction,
    passwordReset, 
    chanegOldPass
}
