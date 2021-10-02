'use strict'

const app= require('express');
const serverHttp= require('http').Server(app);
const io = require('socket.io')(serverHttp,{
    cors:{
        origin: "http://localhost:3000",
        credentials:true
    }
});


var myMessages=[];

io.on('connection', function (socket){
    socket.on('send-message', function(data){
        myMessages.push(data);
        socket.emit('text-event',myMessages);
        socket.broadcast.emit('text-event',myMessages);
        console.log(myMessages);
    });

    socket.on('init-app', function(data){
        myMessages=[];
        
    });

    socket.on('send-like', function(data){
        data.likes= data.likes+1;
        myMessages[data.id-1]=data;
        socket.emit('like-event',myMessages);
        console.log(myMessages);
        socket.broadcast.emit('like-event',myMessages);
    });
});

serverHttp.listen(3000, () =>{
    console.log(`Server on port ${3000}`);
});