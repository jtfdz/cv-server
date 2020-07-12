const db = require('./db');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
let sessionHelper = require('../models/session');
const config = require('./config');


module.exports.registrarUsuario = async (data) => {
    try{
        const result = await db.result(config.q1, [data.username, bcrypt.hashSync(data.passwords.password, 10), data.nombre, sessionHelper.getCurrentTime(), data.email] );
        return result
    }catch(err){
        throw err
    }
}

module.exports.getUserByUsername = async (username) => {
    try{
        const data = await db.oneOrNone(config.q2, [username]);
        return data;
    }catch(err){
        throw err
    }
}

module.exports.checkingEmail = async (correo) => {
    try{
        const data = await db.oneOrNone(config.q3, [correo]);
        return data;
    }catch(err){
        throw err
    }
}

module.exports.getUserById = async (id) => {
    try{
        const data = db.oneOrNone(config.q4, [id]);
        return data;
    }catch(err){
        throw err
    }
}

module.exports.comparePassword = async (candidatePassword, hash) => {
    return bcrypt.compare(candidatePassword, hash);
}








module.exports.Despliegue = async (id) => {
    try{
        const result = await db.any('SELECT * FROM pagina WHERE id_usuario = $1', [id])
        return result;
    }catch(err){
        throw err
    }
}


module.exports.postDespliegue = async (id,pid) => {
    try{
        const data = await db.any('SELECT * FROM post WHERE id_pw = $1 AND id_post = $2', [id,pid])
        return data;
    }catch(err){
        throw err
    }
}


module.exports.postCrear = async (data,id) => {
    try{
        const result = await db.none('INSERT INTO post (id_post,titulo_post,contenido_post,fecha_post,id_pw,imagen_post) VALUES (default, $1, $2, $3, $4, $5)' , [data.titulo,data.contenido,sessionHelper.getCurrentTime(),id,data.imagen])
        return result
    }catch(e){
        throw e;
    }
}

module.exports.postModificar = async (data,id) => {
    try {
        const result = await db.none('UPDATE post SET titulo_post = $1, contenido_post = $2, imagen_post = $3,  WHERE id_post = $5', [data.titulo,data.contenido,data.imagen]);
        return result
    }catch(e){
        throw e;
    }
}


module.exports.postBorrar = async (data) => {
    try{
        const result = await db.none('DELETE FROM post WHERE id_pagina = $1 ', [data.id_pagina])
        return result
    }catch(e){
        throw e;
    }
}



