// SUBIDA DE ARCHIVOS
const { request, response } = require('express');
const path = require('path');
const { uploadFiles } = require('../helpers/uploader');
const { getConnection } = require('../database/database');

// Solo admins podrán subir archivo
const postFile = async(req = request, res = response) =>{
    // Verifica que el usuario sea administrador
    if(!req.usuario || req.usuario.rol !== 'admin') {
        return res.status(403).json({ok:false, msg:"Sin permisos necesarios"});
    }
    try{
        // req.files se encarga de traer archivos | verificamos que no esté vacio
        if(!req.files || Object.keys(req.files).length === 0 || !req.files.file){
            // Si no tiene archivo err 204 -sin contenido
            return res.status(204).send("No se subieron archivos");
        }

        const file = req.files.file;
        // Verificamos si es pdf usando método path | en caso de que la ext esté en mayus, pasamos a minus
        const fileExtension = path.extname(file.name).toLowerCase();
        // Si no ex estensión pdf retorna err -solicitud errónea
        if(fileExtension !== '.pdf') return res.status(400).json({ ok:false, msg:"Extensión no permitida"});

        // Si es correcto, guardamos el archivo
        const fileId = await uploadFiles(file);
        res.status(200).json({ok: true, fileId, msg: "Subido con éxito"});
    } catch(error) {
        console.error(error.message);
        res.status(404).json({ok: false, err});
    }
};

// Los usuarios comunes podrán descargar los archivos
const getFile = async (req = request, res = response) => {
    // Verifica que el rol del usuario sea usuario(común)
    if(!req.usuario || req.usuario.rol !== 'usuario') return res.status(403).json({ ok:false, msg:"Sin permisos necesarios" });

    try {
        const connection = await getConnection();
        // En constante recibo guardamos consulta qsl
        const [receipt] = await connection.query('SELECT * FROM recibo WHERE usuario_id = ?', [req.usuario.id]);

        // Si la longitud del recibo es 0(nula)
        if (receipt.length === 0) return res.status(404).json({ ok:false, msg:"No se encontró el recibo" });
        res.status(200).json({ ok: true, receipt });
    } catch (error) {
        res.status(500).json({ ok: false, e, msg: "Error en servidor" });
        console.log(error.message);
    }
};

module.exports = { postFile, getFile };