// Router para usar metodos POST-PUT-GET-DELETE-PATCH
const { Router } = require('express');
// Métodos de controlador
const methods = require('../controllers/UserController.js');
// Autenticación
const { authJWT } = require('../middlewares/jwt.js');
// Roles de usuario
const { verifyRole } = require('../middlewares/userRoles.js');


// Instancia router
const router = Router();

// Configuramos cada endpoint con su método;
router.post('/users/register-admin', authJWT, verifyRole('superUser'), methods.registerAdmin);
router.post('/users/register-user', authJWT, verifyRole('admin'), methods.register);
router.post('/users/login', authJWT, verifyRole('superUser'), methods.login);
// :id es un path parameter, express lo divide y coloca en req.params
/* Colocamos el middleware para evitar que cualquiera que consulte el endpoint vea el token
que solo se puede conseguir mediante autenticación en login */
// router.get('/users/:id', authenticateJWT, methods.getOne);

// Exportamos router
module.exports = router;
