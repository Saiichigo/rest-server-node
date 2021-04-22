const { Router } = require('express');
const { check} = require('express-validator');

const { usuariosGet, usuariosPost, usuariosPatch, usuariosDelete, usuariosPut} = require('../controllers/user');

const { esRoleValido, existeEmail, existeUsuarioPorId } = require('../helper/db-validators');
const validarCampos = require('../middlewares/validar-campos');

const router = Router();

router.get('/', usuariosGet);

router.put('/:id',[
    check('id', 'no es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRoleValido),
    validarCampos

], usuariosPut);

router.post('/', [
    check('nombre', 'El nombre no puede estar vacio').not().isEmpty(),
    check('password', 'La clave es invalida o menos a 6').isLength({min: 6}),
    check('correo', 'el correo no es valido').isEmail(),
    check('correo', 'el correo no es valido').custom(existeEmail),
    // es igual a esto (console.log)
    check('rol').custom(esRoleValido),
    // check('rol', 'No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    validarCampos

], usuariosPost);

router.delete('/:id',[
    check('id', 'no es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosDelete);
 
router.patch('/', usuariosPatch)




module.exports = router;