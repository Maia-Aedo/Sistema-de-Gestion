const app = require('./app');

const main = () =>{
    app.listen(3000, () => {
        console.log('Servidor en ejecución en http://localhost:3000');
    });    
};

// Lamamos fn
main()
