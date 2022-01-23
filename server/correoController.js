const {request,response}= require('express');
const nodeMailer= require('nodemailer');

const envioCorreo= (user)=>{
    // let body=req.body;
    console.log('Si señorrr');

    let transporter= nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth:{
            user: 'julianortiz9824@gmail.com', // generated ethereal user
            pass: 'Julian1324' // generated ethereal password
        }
    });

    let info = transporter.sendMail({
        from: '"USBLive 📚" <julianortiz9824@gmail.com>', // sender address
        to: "julian-ortiz98@hotmail.com, jaortizc@correo.usbcali.edu.co", // list of receivers
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