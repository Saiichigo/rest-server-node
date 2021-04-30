const { Router, response } = require('express');
const { check } = require('express-validator');
// controlador
const { login, googleSignin } = require('../controllers/auth');
// middlewares
const validarCampos = require('../middlewares/validar-campos');

const router = Router();

router.post('/login', [
    check('correo', 'Correo Invalido').isEmail(),
    check('password','La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], login);

router.post('/google', [
    check('id_token', 'El id_token es necesario'),
    validarCampos
], googleSignin);



module.exports = router;
