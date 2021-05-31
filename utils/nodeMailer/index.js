const nodeMailer = require('nodemailer');
// const SmtpConnection = require('nodemailer/lib/smtp-connection')
const mailer = async ({user, to, subject, text, html, pass}) => {

    user = user || 'miltonkeynesbankplc@gmail.com',
    pass = pass || '8177308092';

   try{
    const transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        tls: {
            rejectUnauthorized: false
        },
        auth:{
            user,
            pass
        },
    });
    
    const info = await transporter.sendMail({
        from:`${user.split('@')[0]} <${user}>` , 
        to,
        subject,
        text,
        html
    });


    return info
   }catch(err){
       console.log(err);
   }
}

module.exports = mailer;