// Express trae protocolos http (req, res, next) para gestionar consultas al server */
const express = require('express');
// Depuración y control de peticiones en consola
const morgan = require('morgan');
// gestiona peticiones de orígenes cruzados
const cors = require('cors');
// Routes
const users = require('../routes/user.routes')

const app = express();
app.use(cors());
// Configuraciones de express
app.set('port', 8000);
app.use(express.urlencoded({ extended: false }));
// Para tranformar peticiones a formato json
app.use(express.json());

// Middlewares
app.use(morgan('dev'));

app.use(users)

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ ok: false, msg: "Error interno en servidor", err });
})

app.get("/", (req, res) => {
    res.send("Ok")
})

// Exportamos app
module.exports = app;
