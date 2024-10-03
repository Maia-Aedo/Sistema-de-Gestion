// dotenv permite leer las variables de entorno
const { config } = require('dotenv');

config();

/* Exportamos modulo con ref a las variables de entorno 
instanciamos para BD, key para token*/
module.exports = {
    host: process.env.db_host,
    port: process.env.db_port,
    database: process.env.db_database,
    user: process.env.db_user,
    password: process.env.db_contrasena,
    secretKey: process.env.secret_seed
};
