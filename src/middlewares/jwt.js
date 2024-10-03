const jwt = require('jsonwebtoken');
const config = require('../uploads/config');
// Métodos de express
const { response, request, next } = require('express')

const authJWT = (req = request, res = response, next = next) =>{
    // Extraemos propiedad authorization que tiene el token
    const authHeader = req.headers['authorization'];
    // Con split dividimos bearer(token), el segundo index(1) del array obtenido es el que contiene el dato
    const token = authHeader && authHeader.split(" ")[1];
    // Token pasa a ser string, si es nulo devuelve error -no autorizado
    if(token == null) return res.sendStatus(401).json({ ok:false, msg:"Ningún token fue provisto"});
    // Verificamos que la firma sea correcta | verify obtiene como parámetros token y key
    jwt.verify(token, config.secretKey, (err, usuario) =>{
        // Si hay error en verificación devuelve error -prohibido
        if(err) return res.sendStatus(403).json({ok:false, msg:"Token inválido"});
        // Si no hay err, next permite al usuario continuar la petición
        // De ser necesario, guardar usuario en el request para usar en rutas protegidas
        req.usuario = user;
        // Pasa al siguiente middleware-ruta
        next();
    })
}

/* Fn NO MIDDLEWARE - gestiona creación del token
Recibe usuario que pasa a ser parte del payload */
const generateJWT = async(usuario) =>{
    // Generamos payload con info del usuario
    const payload = {
        sub: usuario.id,
        name: usuario.nombre
    };

    const options = {
        // Duración de 24h
        expiresIn: '3h'
    };
    // Retornamos token para que pueda ser usado en peticiones
    return jwt.sign(payload, config.secretKey, options);
}

// Exportamos functions
module.exports = { authJWT, generateJWT };
