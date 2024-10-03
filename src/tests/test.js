// ARCHIVO PARA PRUEBAS MANUALES - usando http que nos permite realizar peticiones

// Registrar user
const http = require('http');

// Creamos obj con datos del nuevo user y lo convertimos a formato json
const data = JSON.stringify({
    nombre: 'testuser',
    contrasena: 'testpassword',
    email: 'test@user.com',
    rol_nombre: 'super'
});

// Definimos obj con las configs para la solicitud
const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/users/register-super',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json', // El cuerpo de la solicitud es json
        'Content-Length': Buffer.byteLength(data), // Declaramos tamaño del cuerpo
    },
};

// Creamos en la solicitud http con el obj options
const req = http.request(options, (res) => {
    // Acá guardamos resp del server
    let responseBody = '';

    // on escucha los datos recibidos y el evento se dispara cada vez que recibe nuevo fragmento
    res.on('data', (chunk) => {
        /* chunk representa un FRAGMENTO de la respuesta
        Cada fragmento recibido se agrega a responsebody y va concatenando toda la resp */
        responseBody += chunk;
    });

    // El evento se ejecuta cuando ya no hay más datos (porque se recibieron todos)
    res.on('end', () => {
        // Imprimimos la resp en formato json
        console.log('El registro fue exitoso:', (responseBody));
    });
});

// Manejo de errores | el evento se ejecuta en caso de error en la solicitud
req.on('error', (error) => {
    console.error('Ocurrió un error en el registro:', error.message);
});

// Enviamos CUERPO de la solicitud al servidor (los datos del nuevo user)
req.write(data);
// Terminamos la solicitud
req.end();


// log in - probamos login con el user creado
const loginData = JSON.stringify({ // Creamos obj json con datos para login
    nombre: 'testuser',
    contrasena: 'testpassword'
});

// Definimos las configs para realizar la solicitud
const loginOptions = {
    hostname: 'localhost',
    port: 3000,
    path: '/users/login',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(loginData), // La longitud será tipo logindata(obj creado)
    },
};

const loginReq = http.request(loginOptions, (res) => { // Realizamos petición con el user logged in
    let responseBody = ''; // Creamos cadena vacia para almacenar la resp

    // Los datos recibidos se agregarán a la var vacía
    res.on('data', (chunk) => {
        responseBody += chunk;
    });

    // Cuando no hay más datos para recibir se ejecuta
    res.on('end', () => {
        const response = responseBody;
        console.log('El login ha sido exitoso:', response);
        // Extraemos el token para usarlo
        const token = response.token;

        // Imprime el token
        console.log('Token JWT:', token);

    });
});

// En caso de error
loginReq.on('error', (error) => {
    console.error('Error en el login:', error.message);
});

// Enviamos solicitud al server
loginReq.write(loginData);
loginReq.end();



