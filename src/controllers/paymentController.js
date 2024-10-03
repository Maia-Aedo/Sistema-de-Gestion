const { getConnection } = require('../database/database');

// Administrador registra pago
const registerPayment = async (req = request, res = response) => {
    // Guardamos el id del usuario y el monto del payment
    const { usuarioId, monto } = req.body;
    // Si el usuario no es admin devuelve err -prohibido
    if(req.usuario.rol !== 'admin') return res.status(403).json({ ok:false, msg:"Sin permisos necesarios" });

    try {
        const connection = await getConnection();
        // Genera nuevo pago | ? reemplaza por el id del usuario y el monto del pago
        await connection.query('INSERT INTO pagos (usuario_id, monto) VALUES (?, ?)', [usuarioId, monto]);
        res.status(201).json({ ok:true, msg:"Pago registrado con éxito" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ ok:false, e, msg:"Error en servidor" });
    }
};

// Los usuarios comunes podrán ver los pagos
const getPayments = async (req = request, res = response) => {
    // Si el usuario no es usuario(común)
    if(req.usuario.rol !== 'usuario') return res.status(403).json({ ok:false, msg:"Sin permisos necesarios" });
    try {
        const connection = await getConnection();
        // ? se reemplazará por el id correcto
        const [payments] = await connection.query('SELECT * FROM pagos WHERE usuario_id = ?', [req.usuario.id]);
        // Devuelve ok con result de la query
        res.status(200).json({ ok:true, payments });
    } catch (error) {
        console.log(error.msg);
        res.status(500).json({ ok:false, e, msg:"Error en servidor" });
    }
};

module.exports = { registerPayment, getPayments };
