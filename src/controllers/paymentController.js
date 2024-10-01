const { getConnection } = require('../database/database');

// Administrador registra pago
const registerPayment = async (req = request, res = response) => {
    // Guardamos el id del usuario y el monto del payment
    const { userId, amount } = req.body;
    // Si el usuario no es admin devuelve err -prohibido
    if(req.user.role !== 'admin') return res.status(403).json({ ok:false, msg:"Sin permisos necesarios" });

    try {
        const connection = await getConnection();
        // Genera nuevo pago | ? reemplaza por el id del user y el monto del pago
        await connection.query('INSERT INTO payments (user_id, amount) VALUES (?, ?)', [userId, amount]);
        res.status(201).json({ ok:true, msg:"Pago registrado con éxito" });
    } catch (e) {
        console.log(e);
        res.status(500).json({ ok:false, e, msg:"Error en servidor" });
    }
};

// Los usuarios comunes podrán ver los pagos
const getPayments = async (req = request, res = response) => {
    // Si el usuario no es user(común)
    if(req.user.role !== 'user') return res.status(403).json({ ok:false, msg:"Sin permisos necesarios" });
    try {
        const connection = await getConnection();
        // ? se reemplazará por el id correcto
        const [payments] = await connection.query('SELECT * FROM payments WHERE user_id = ?', [req.user.id]);
        // Devuelve ok con result de la query
        res.status(200).json({ ok:true, payments });
    } catch (e) {
        console.log(e);
        res.status(500).json({ ok:false, e, msg:"Error en servidor" });
    }
};

module.exports = { registerPayment, getPayments };
