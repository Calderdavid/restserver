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

//configuracion de open ai

const {Configuration, OpenAIApi} = require("openai");

const config = new Configuration({
    // organization: "org-bWueNUMsqtPyzLM1Y5Jta0JO",
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

// router.post('/chat', async(req, res) => {

//     const { prompt } = req.body;


//     const completion = await openai.createCompletion({
//         model: "text-davinci-003",
//         max_tokens: 512,
//         temperature: 0.6,
//         prompt: prompt
//     });
//     res.send(completion.data.choices[0].text)
// })


router.post("/chat", async(req, res) => {

    const { prompt } = req.body;

    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            {
                "role": "system",
                "content": "Eres un asistente que tienes conocimientos acerca hábitos saludables de alimentación y entrenamientos"
            },
            ...prompt
        ],
        temperature: 0.7
    });
    // console.log(completion.data.choices[0].message)
    res.send(completion.data.choices[0].message.content)
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