const {request,response}= require('express');
const nodeMailer= require('nodemailer');

const envioCorreo= (user)=>{
    // let body=req.body;
    console.log('Si señorrr');

    // let transporter= nodeMailer.createTransport({
    //     host: 'smtp.gmail.com',
    //     port: 465,
    //     secure: false,
    //     auth:{
    //         user: 'julianortiz9824@gmail.com', // generated ethereal user
    //         pass: 'Julian1324' // generated ethereal password
    //     }
    // });

    let transporter= nodeMailer.createTransport({
        host: "smtp-mail.outlook.com", // hostname
        secureConnection: false, // TLS requires secureConnection to be false
        port: 587, // port for secure SMTP
        tls: {
            ciphers:'SSLv3'
        },
        auth: {
            user: 'julian-ortiz98@hotmail.com',
            pass: 'Julian9824'
        }
    });

    transporter.sendMail({
        from: '"USBLive 📚" <julian-ortiz98@hotmail.com>', // sender address
        to: "julianortiz9824@gmail.com", // list of receivers
        subject: "Alerta de propuesta", // Subject line
        text: `El estudiante: ${user.user} alcanzó ${user.likes} likes. Su mensaje es: ${user.text}`, // plain text body
        // html: "<b>Hello world?</b>", // html body
    },(res,err)=>{
        if(err){
            console.log(err);
        }
        return res.message;
    });
}

module.exports={
    envioCorreo
}