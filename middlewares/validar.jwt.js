const jwt = require('jsonwebtoken');
const { response } = require('express');
const Usuario = require('../models/usuario');

const validarJWT = async(req, res = response, next) => {
  const token = req.header('x-token');

  if (!token) {
    return res.status(401).json({
      msg: 'No hay token en la peticion',
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    // leer el usuario que corresponde al uid
    
    const usuario =  await Usuario.findById(uid);

    if ( !usuario ) {
        return res.status(401).json({
            msg: 'Usuario no existe en base de datos'
        })
    }

    // verificar el uid tiene estado en true
    if ( !usuario.estado ) {
        return res.status(401).json({
            msg: 'token no valido - usuario con estado: false '
        })
    }

    req.usuario = usuario ;

    next();


  } catch (error) {

    console.log(error);
    return res.status(401).json({
      msg: 'Token no valido',
    });
  }

  //   next();
};
module.exports = {
  validarJWT,
};
