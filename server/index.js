'use strict';

const app= require('express');
const serverHttp= require('http').createServer(app);
const envio= require('./correoController');
const io = require('socket.io')(serverHttp,{
    origins: '*',
    credentials: false
});

var myMessages=[];

io.on('connection', function (socket){
    socket.on('send-message', function(data){
        myMessages.push(data);
        socket.emit('text-event',myMessages);
        socket.broadcast.emit('text-event',myMessages);
    });

    socket.on('init-app', function(data){
        myMessages=[];
        console.log('Empezamos');
    });

    socket.on('send-like', function(data){
        data.likes= data.likes+1;
        myMessages[data.id-1]=data;
        socket.emit('like-event',myMessages);
        socket.broadcast.emit('like-event',myMessages);

        if(myMessages[data.id-1].likes==5){
            envio.envioCorreo(myMessages[data.id-1]);
            socket.emit('email-sent',true);
            socket.broadcast.emit('email-sent',true);
            console.log('Ya se mandó el correo');
        }
    });

    socket.on('delete-comment', function(data){
        myMessages[data.id-1].userComments= data.userComments;
        socket.emit('deleteC-event',myMessages);
        socket.broadcast.emit('deleteC-event',myMessages);
    });

    socket.on('send-comment', function(data){

        // console.log(data);

        if(myMessages[data.commentID-1].userComments!=undefined){
            myMessages[data.commentID-1].userComments.push({comment: data.comment, user: data.user});
        }else{
            myMessages[data.commentID-1].userComments=[{comment: data.comment, user: data.user}];
        }

        console.log(myMessages);
        socket.emit('comment-event',myMessages);
        socket.broadcast.emit('comment-event',myMessages);
    });

    socket.on('delete-post', function(data){
        
        for (let i = 0; i < myMessages.length; i++) {
            if(myMessages[i].id==data.id){
                myMessages.splice(i,1);
            }
            
        }
        socket.emit('deleteP-event',myMessages);
        socket.broadcast.emit('deleteP-event',myMessages);
    });
});

serverHttp.listen(3000, () =>{
    console.log(`Server on port ${3000}`);
});

const express= require('express');

const app2= express();

app2.use(require('./routes'));

app2.set('port', process.env.PORT || 4000);
// app2.use(require('./routes'));

app2.listen(app2.get('port'), () => {
    console.log("Server on port: "+app2.get('port'));
});