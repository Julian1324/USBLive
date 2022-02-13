const express= require('express');
const router= express.Router();

let envio= require('./correoController');

//const pool = require('../database');
router.get('/envio',envio.envioCorreo);
router.get('/',(req,res)=>{
    res.send('Hello');
});

module.exports= router;