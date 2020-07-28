const db = require('./db');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
let sessionHelper = require('../models/session');
const config = require('./config');


module.exports.registrar = async (data) => {
    try{
        const result = await db.result(config.q1, [data.username, bcrypt.hashSync(data.password, 10), data.nombre, sessionHelper.getCurrentTime(), data.email, data.tipo] );
        return result
    }catch(err){
        throw err
    }
}

module.exports.correoTemporal = async (id,code) => {
    try{
        const result = await db.result(config.q13, [id,code] );
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


module.exports.notaCrear = async (data,id) => {
    try{
        const result = await db.none(config.q5 , [id, data.tipo, data.contenido, sessionHelper.getCurrentTime(), data.titulo])
        return result
    }catch(e){
        throw e;
    }
}

module.exports.notasMostrar = async (id) => {
    try{
        const result = await db.any(config.q6, [id])
        return result;
    }catch(err){
        throw err
    }
}

module.exports.estadisticas = async (id) => {
    try{
        const data = [];
        data[0] = await db.any(config.q7, [id]);
        data[1] = await db.any(config.q8, [id]); 
        data[2] = await db.any(config.q9, [id]);        
        return data;
    }catch(err){
        throw err
    }
}


module.exports.notaBorrar = async (data, id) => {
    try{
        const result = await db.none(config.q10, [data, id])
        return result
    }catch(e){
        throw e;
    }
}

module.exports.notaMostrar = async (id) => {
    try{
        const data = await db.any(config.q11, [id])
        return data;
    }catch(err){
        throw err
    }
}


module.exports.notaEditar = async (data, idn, idu) => {
    try {
        const result = await db.none(config.q12, [data.titulo,data.contenido,idn, idu]);
        return result
    }catch(e){
        throw e;
    }
}




