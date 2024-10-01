// Damos id únicos a los archivos
const { v4: uuidv4 } = require('uuid');
// Trabajamos sobre path del proyecto
const path = require('path');
// Definimos extensión permitida
const extensions = ["pdf"];

const uploadFiles = (fileToUpload) => {
    return new Promise((resolve, rejected) =>{
        // obtiene el archivo
        const {file} = fileToUpload; 
        // obtiene la extension y nombre de archivo | hace un split desde el . para obtener extension
        const extensionAndName = file.name.split(".");
        const extension = extensionAndName[extensionAndName.length - 1]; // obtiene sólo la extension
        // comprobamos que la extension sea una de las declaradas
        if(!extensions.includes(extension)){
            // si no cumple, devolvemos un rejected
            return rejected({msg: `Extensiones permitidas: ${extensions}`});
        }
        // si cumple, le damos un nombre temporal + su extension
        const tempName = uuidv4() + "." + extension; // crea un id unico para el archivo
        // le damos la dir donde se va a guardar (carpeta uploads)
        const uploadPath = path.join(__dirname, '../uploads', tempName);
        // si falla, muestra error
        file.mv(uploadPath, function(err){
            if(err){
                rejected(err); // carga errores
            }
            resolve(tempName); // retorna nombre de archivo
        });
    });
};

// exportamos
module.exports = {uploadFiles}
