/* Abre pool de conexión con la BD 
le da una query y recibe res devolviendolo como obj 
cada connection es única, se abre al obtener datos y cierra luego */
const mysql = require('mysql2/promise');
const config = require('../uploads/config');

// Generamos conexión
const connection = mysql.createConnection({
    host: config.host,
    port: config.port,
    database: config.database,
    user: config.user,
    password: config.password
});

const getConnection = async () => {
    console.log('Conectado a la BD');
    return connection;
};

// Obtiene conexión y exporta
module.exports = { getConnection };
