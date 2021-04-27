const { response, request } = require('express');
const bcryptjs = require('bcryptjs');


const Usuario = require('../models/usuario');
const { generarJWT } = require('../helper/generar-jwt');

const login = async (req = request, res = response) => {

  const {correo, password} = req.body;

  try {


    // verificar si el email existe
    const usuario = await Usuario.findOne({ correo });
    console.log(usuario);
    if (!usuario) {
      return res.status(400).json({
        msg : 'Usuario / Passwor no son correctos - Correo'
        // http:localhost:8080/api/auth/login
      })
      
    }

    // Si el usuario esta activo
    if (!usuario.estado) {
      return res.status(400).json({
        msg : 'Usuario / Password no son correctos - estado: false'
        // http:localhost:8080/api/auth/login
      })
    }

    // verificar la contraseña
    const validPassword = bcryptjs.compareSync( password, usuario.password);
  
    if (!validPassword) {
      return res.status(400).json({
        msg : 'Usuario / Password no son correctos - password'
        // http:localhost:8080/api/auth/login
      })

    }
      // Generar el JWT
      // JWT no tiene una promesa para generarlo, es un callback que se debe convertir a Promesa
      // console.log(Usuario.id);
      const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token
    })

    
  } catch (error) {

    console.log(error);
    return res.status(500).json({
      msg: 'Hable con el administrador'
    })
    
  }
}

module.exports = {
  login
};
