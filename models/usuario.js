const { Schema, model } = require('mongoose');

const UsuarioShema = Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
  },
  correo: {
    type: String,
    required: [true, 'el correo es obligatorio'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
  },
  img: {
    type: String,
  },
  rol: {
    type: String,
    required: true,
  },
  estado: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
});

// crear metodos
UsuarioShema.methods.toJSON = function(){
  // se usa una funcion normal porque se necesita usar el this
  const {__v, password, _id,...usuario} = this.toObject();
  usuario.uid = _id;

  return usuario
}

module.exports = model('Usuario', UsuarioShema);
