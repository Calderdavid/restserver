const { Router } = require('express');
const { check } = require('express-validator');

//middlwares
// const {validarCampos} = require('../middlewares/validar-campos')
// const { validarJWT } = require('../middlewares/validar-jwt');
// const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');
const {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole
 } = require('../middlewares');

const { esRolValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');

const {Configuration, OpenAIApi} = require("openai");

const config = new Configuration({
    apiKey: "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",
})

const openai = new OpenAIApi(config);


const { 
    usuariosGet, 
    usuariosPut, 
    usuariosPost, 
    usuariosPatch, 
    usuariosDelete } = require('../controllers/usuarios');


const router = Router();

router.get('/', usuariosGet);

router.put('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom( esRolValido ), 
    validarCampos
] , usuariosPut);

router.post('/', [
    check('nombre', 'El nombre no es válido').not().isEmpty(),
    check('password', 'El password debe tener mas de 6 letras').isLength({min: 6}),
    check('correo').custom( emailExiste ),
    check('rol').custom( esRolValido ), 
    validarCampos
] , usuariosPost);

router.post('/chat', async(req, res) => {

    const { prompt } = req.body;


    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        max_tokens: 512,
        temperature: 0.6,
        prompt: prompt
    });
    res.send(completion.data.choices[0].text)
})

router.patch('/', usuariosPatch);

router.delete('/:id',[
    validarJWT,
    // esAdminRole,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE', 'OTRO_ROLE'),
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
],usuariosDelete);




module.exports = router;