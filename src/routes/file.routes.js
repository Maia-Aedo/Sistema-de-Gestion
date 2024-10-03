const { Router } = require("express");
// Autenticación
const { authJWT } = require("../middlewares/jwt");
// Métodos de controlador
const methods = require("../controllers/upload-file.controller");
// Middleware de roles
const { verifyRole } = require('../middlewares/userRoles');

// Iinstancia router
const router = Router();

// Configuramos cada endpoint con su método;
router.post("/upload", authJWT, verifyRole('admin') ,methods.postFile);// solo los usuarios logeados pueden cargar archivos
router.get('/recibos', authJWT, verifyRole('user'), methods.getPayments)

module.exports = router;

