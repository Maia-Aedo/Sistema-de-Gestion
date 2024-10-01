// Verificamos el rol del usuario
// Fn recibe role - dependiendo de rol, permite acceso a determinadas rutas
const verifyRole = (role) => {
    return (req, res, next) => {
        // Verificamos si el rol coincide requerido(parámetro)
        if (req.user.role !== role) {
            // Si no coinciden, devuelve err -prohibido
            return res.status(403).json({ ok:false, msg:"Sin permisos" });
        }
        // Si el rol es correcto, avanza al sig middleware-controller
        next();
    };
};

module.exports = { verifyRole };
