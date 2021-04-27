const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
// const { validationResult } = require('express-validator');

const Usuario = require('../models/usuario');

// const { validate } = require('../models/usuario');

const usuariosGet = async (req = request, res = response) => {
  // const { q, nombre = 'no name', apikey, page = 1, limit } = req.query;

  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };
  // const usuarios = await Usuario.find({ estado: true })
  //   .skip(Number(desde))
  //   .limit(Number(limite));

  // const total = await Usuario.countDocuments();

  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query) 
    .skip(Number(desde))
    .limit(Number(limite))
  ]);

  res.json({ total, usuarios });
};

const usuariosPost = async (req = request, res = response) => {
  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario({ nombre, correo, password, rol });

  // Encriptar la contraseña
  const salt = bcryptjs.genSaltSync(10);
  usuario.password = bcryptjs.hashSync(password, salt);

  // Guardar en BD
  await usuario.save();

  res.json({
    msg: 'Post  API - Controlador',
    usuario,
  });
};

const usuariosDelete = async(req = request, res = response) => {


  const {id} = req.params;

  // const uid = req.uid


  // fisicamente lo borramos
  // const usuario = await Usuario.findByIdAndDelete(id);
  
  const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

  const usuarioAutenticado = req.usuario



  res.json(
    usuario,
  );
};

const usuariosPut = async (req = request, res = response) => {
  const { id } = req.params;
  const { _id, password, google, correo, ...resto } = req.body;

  // TODO validar contra la base de datos
  if (password) {
    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync(10);
    resto.password = bcryptjs.hashSync(password, salt);
  }

  const usuario = await Usuario.findByIdAndUpdate(id, resto);

  res.status(500).json(usuario);
};

const usuariosPatch = (req = request, res = response) => {
  res.status(500).json({
    msg: 'Patch  API - Controlador',
  });
};

module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosDelete,
  usuariosPatch,
};
