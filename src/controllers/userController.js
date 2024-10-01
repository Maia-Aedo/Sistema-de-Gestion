/** -1-
 * SIN DESESTRUCTURACIÓN
 * const id = req.params.id;
 */

// Traemos getConnection para gestionar conexión a BD
const { getConnection } = require('../database/database');
// Para registrar, otorga fn para hashear password
const bcrypt = require('bcrypt');
const { generateJWT } = require('../middlewares/jwt')

const registerAdmin = async(req = request, res = response) => {
    // Obtenemos usuario aplicando desestructuración
    const user = { ...req.body };
    const salt = 12;// valor aleatorio para hasheo
    // Si no existe user, err no autorizado
    if(!user) res.status(401).json({ok: false, msg: "No autorizado"});
    if(req.user.role !== 'superUser') return res.status(403).json({ok:false, msg:"Sin permisos necesarios"});

    try{
        // Cambiamos password por la nueva hasheada
        user.password = await bcrypt.hash(user.password, salt);
        user.role = 'admin'
        const connection = await getConnection();
        // Pasamos la query
        const result = await connection.query('INSERT INTO users SET ?', user);
        res.status(201).json({ok: true, result, msg: "Admin creado"});
    } catch(e){
        console.log(e);
        res.status(500).json({ok: false, e, msg: "Error en servidor"});
    }
};

const register= async(req = request, res = response) => {
    const user = { ...req.body };
    const salt = 12;
    
    if(!user) res.status(401).json({ok: false, msg: "No autorizado"});
    if(req.user.role !== 'admin') return res.status(403).json({ok:false, msg:"Sin permisos necesarios"});

    try{
        
        user.password = await bcrypt.hash(user.password, salt);
        user.role = 'user'
        const connection = await getConnection();

        const result = await connection.query('INSERT INTO users SET ?', user);
        res.status(201).json({ok: true, result, msg: "Usuario creado"});
    } catch(e){
        console.log(e);
        res.status(500).json({ok: false, e, msg: "Error en servidor"});
    }
};

const login = async(req = request, res = response) => {
    const user = { ...req.body };// Obtenemos user
    // Si no existe, muestra error
    if(!user) res.status(401).json({ok: false, msg: "no autorizado"})
    
    // Consultamos BD por Username
    try{
        const connection = await getConnection();
        const [result] = await connection.query(
            'SELECT * FROM users WHERE username = ?',
            user.username
        );
        // Si la consult no devuelve nada, err -no encontrado
        if(!result[0]) res.status(404).json({ok: false, msg: "usuario no encontrado"});
        // compare retorna boolean dependiendo si la contraseña es correcta o no
        const isPassword = await bcrypt.compare(user.password, result[0].password);

        if(isPassword){
            // Si es correcta, genera el token, enviando obj user como argumento
            const token = await generateJWT(result[0]);
            res.status(200).json({ok: true, token, msg: "Login"});
        }else{
            res.status(401).json({ok: false, msg: "Contraseña incorrecta"});
        }
    }catch(e){
        console.error(e);
        res.status(500).json({ok: false, e, msg: "Error en servidor"});
    }
};

// Exportamos todas las funciones
module.exports = { registerAdmin, register, login }
