const { Router } = require('express');
// Métodos de controlador
const methods = require('../controllers/paymentController.js');
// Autenticación
const { authJWT } = require('../middlewares/jwt');
// Middleware para verificar los roles
const { verifyRole } = require('../middlewares/userRoles');
const router = Router();

// Ruta para registrar pagos (solo admin)
router.post('/payments/register', authJWT, verifyRole('admin'), methods.registerPayment);
// Ruta para ver pagos
router.get('/payments/user', authJWT, verifyRole('user'), methods.getPayments);

module.exports = router;
