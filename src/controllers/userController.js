/** -1-
 * SIN DESESTRUCTURACIÓN
 * const id = req.params.id;
 */

// Traemos getConnection para gestionar conexión a BD
const { getConnection } = require('../database/database');
// Para registrar, otorga fn para hashear contrasena
const bcrypt = require('bcrypt');
const { generateJWT } = require('../middlewares/jwt')

// Registro para user con rol admin
const registerAdmin = async (req = request, res = response) => {
    // Obtenemos usuario aplicando desestructuración
    const usuario = { ...req.body };
    const salt = 12;// valor aleatorio para hasheo
    // Si el usuario es nulo, err no autorizado
    if (!usuario) res.status(401).json({ ok: false, msg: "No autorizado" });

    try {
        // Cambiamos contrasena por la nueva hasheada
        usuario.contrasena = await bcrypt.hash(usuario.contrasena, salt);
        usuario.rol = 'admin'
        const connection = await getConnection();
        // Pasamos la query donde insertamos el nuevo user en la tabla
        // const result = await connection.query('INSERT INTO usuario SET ?', usuario);
        const [result] = await connection.execute('INSERT * INTO usuario SET nombre = ?', [usuario.nombre]);
        if (result.length === 0) return null;
        res.status(201).json({ ok: true, result, msg: "Admin creado" });
    } catch (e) {
        console.log(e);
        res.status(500).json({ ok: false, e, msg: "Error en servidor" });
    }
};

// Registro user con rol super
const registerSuper = async (req = request, res = response) => {
    // Obtenemos usuario aplicando desestructuración
    const usuario = { ...req.body };
    const salt = 12;// valor aleatorio para hasheo

    try {
        // Cambiamos contrasena por la nueva hasheada
        usuario.contrasena = await bcrypt.hash(usuario.contrasena, salt);
        usuario.rol = 'super'
        const connection = await getConnection();
        // const result = await connection.query('INSERT INTO usuario SET ?', usuario);
        const [result] = await connection.execute('INSERT * INTO usuario SET nombre = ?', [usuario.nombre]);
        // Si el resultado està vacìo, retorna nulo
        if (result.length === 0) return null;
        res.status(201).json({ ok: true, result, msg: "Admin creado" });
    } catch (e) {
        console.log(e);
        res.status(500).json({ ok: false, e, msg: "Error en servidor" });
    }
};

// Registro user con rol común
const register = async (req = request, res = response) => {
    const usuario = { ...req.body };
    const salt = 12;

    if (!usuario) res.status(401).json({ ok: false, msg: "No autorizado" });

    try {
        usuario.contrasena = await bcrypt.hash(usuario.contrasena, salt);
        usuario.rol = 'usuario'
        const connection = await getConnection();

        // const result = await connection.query('INSERT INTO usuario SET ?', usuario);
        const [result] = await connection.execute('INSERT * INTO usuario SET nombre = ?', [usuario.nombre]);
        if (result.length === 0) return null;
        res.status(201).json({ ok: true, result, msg: "Usuario creado" });
    } catch (e) {
        console.log(e);
        res.status(500).json({ ok: false, e, msg: "Error en servidor" });
    }
};

const login = async (req = request, res = response) => {
    const usuario = { ...req.body };// Obtenemos usuario
    // Si no existe, muestra error
    if (!usuario) res.status(401).json({ ok: false, msg: "no autorizado" })

    // Consultamos BD por nombre de usuario
    try {
        const connection = await getConnection();
        const [result] = await connection.query(
            'SELECT * FROM usuario WHERE nombre = ?',
            usuario.nombre
        );

        console.log(result)
        // Si la consult no devuelve nada, err -no encontrado
        if (!result[0]) res.status(404).json({ ok: false, msg: "usuario no encontrado" });
        // compare retorna boolean dependiendo si la contraseña es correcta o no
        const iscontrasena = await bcrypt.compare(usuario.contrasena, result[0].contrasena);

        if (iscontrasena) {
            // Si es correcta, genera el token, enviando obj usuario como argumento
            const token = await generateJWT(result[0]);
            res.status(200).json({ ok: true, token, msg: "Login" });
        } else {
            res.status(401).json({ ok: false, msg: "Contraseña incorrecta" });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ ok: false, e, msg: "Error en servidor" });
    }
};


// Exportamos todas las funciones
module.exports = { registerAdmin, registerSuper, register, login }
