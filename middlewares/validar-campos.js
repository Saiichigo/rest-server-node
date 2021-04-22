
const { validationResult } = require('express-validator');

const validarCampos = (req, res, next) => { 

const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json(errors);
  }
//   si todo funciona bien el next pasara al siguiente middlewares
  next();

}

module.exports = validarCampos;