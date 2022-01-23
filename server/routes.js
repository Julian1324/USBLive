const express= require('express');
const router= express.Router();

let envio= require('./correoController');

//const pool = require('../database');
router.get('/envio',envio.envioCorreo);

module.exports= router;