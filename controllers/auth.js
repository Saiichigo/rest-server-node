const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helper/generar-jwt');
const { googleVerify } = require('../helper/google-verify');

const login = async (req = request, res = response) => {
  const { correo, password } = req.body;

  try {
    // verificar si el email existe
    const usuario = await Usuario.findOne({ correo });
    console.log(usuario);
    if (!usuario) {
      return res.status(400).json({
        msg: 'Usuario / Passwor no son correctos - Correo',
        // http:localhost:8080/api/auth/login
      });
    }

    // Si el usuario esta activo
    if (!usuario.estado) {
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos - estado: false',
        // http:localhost:8080/api/auth/login
      });
    }

    // verificar la contraseña
    const validPassword = bcryptjs.compareSync(password, usuario.password);

    if (!validPassword) {
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos - password',
        // http:localhost:8080/api/auth/login
      });
    }
    // Generar el JWT
    // JWT no tiene una promesa para generarlo, es un callback que se debe convertir a Promesa
    // console.log(Usuario.id);
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: 'Hable con el administrador',
    });
  }
};



const googleSignin = async(req, res = response) => {
  const { id_token } = req.body;

  try {
    const { correo, nombre, img } = await googleVerify(id_token);
  

    let usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      // crear el usuario
      const data = {
        nombre,
        correo,
        password: 'papapapapap',
        img,
        google: true,
      };
      usuario = new Usuario(data);
      console.log(usuario);
      await usuario.save();
    }

    // si el usuario en DB
    if (!usuario.estado) {
      return res.status(401).json({
        msg: 'Hable con el administrador, usuario bloqueado',
      });
    }
    // generar el JWT
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
    });


  } catch (error) {
    res.status(400).json({
      msg: 'Token de google no es valido',
    });
  }
};

module.exports = {
  login,
  googleSignin,
};
