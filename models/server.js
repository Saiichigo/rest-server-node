const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.usuariosPath = '/api/usuarios'
    
    // conectar a base de datos
    this.conectarDB()


    // Middlewares
    this.middlewares();

    // Rutas de mi aplicacion
    this.routes();
  }

  async conectarDB(){
    await dbConnection()
  }

  middlewares() {
    // CORS
    this.app.use(cors());

    //   Directorio publico
    this.app.use(express.static('public'));

    // Parse y lectura del body
    this.app.use(express.json());

    // // validator
    // this.app.use()
  }

  routes() {
    
    this.app.use(this.usuariosPath, require('../routes/user'));


  }

  lister() {
    this.app.listen(this.port, () => {
      console.log(`SERVIDOR CORRIENDO EN EL PUERTO ${this.port}`);
    });
  }
}

module.exports = Server;
