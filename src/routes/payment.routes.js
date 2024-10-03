const { Router } = require('express');
// Métodos de controlador
const methods = require('../controllers/paymentController.js');
// Autenticación
const { authJWT } = require('../middlewares/jwt');
// Middleware para verificar los roles
const { verifyRole } = require('../middlewares/userRoles');
const router = Router();

// Ruta para registrar pagos (solo admin)
router.post('/pagos/registrar', authJWT, verifyRole('admin'), methods.registerPayment);
// Ruta para ver pagos
router.get('/pagos/usuario', authJWT, verifyRole('usuario'), methods.getPayments);

module.exports = router;
