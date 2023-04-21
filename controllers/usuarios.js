const {response} = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');

const usuariosGet = async(req = request, res = response) => {

    const { limite=5, desde=0 } = req.query;
    const query = {estado: true}

    // const usuarios = await Usuario.find(query)
    // .skip( Number(desde))
    // .limit(Number(limite));

    //const total = await Usuario.countDocuments(query);

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query), 
        Usuario.find(query)
        .skip( Number(desde))
        .limit(Number(limite))])

    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async(req, res = response) => {

    const { 
            nombre, correo, password, rol,
            apellido, genero, fecha_nacimiento, 
            altura, peso
        } = req.body;
    const usuario = new Usuario( {
        nombre, apellido ,genero,fecha_nacimiento,
        altura,peso,correo, password, rol
    });

    //Encriptar la contraseña 
    const salt = bcryptjs.genSaltSync(10);
    usuario.password = bcryptjs.hashSync( password, salt )

    //Guardar en la base de datos
    await usuario.save();

    const token = await generarJWT(usuario.id, usuario.nombre);
        
        
    res.status(201).json({
        ok: true,
        msg: 'post api - controlador',
        usuario,
        token
    })
}

const usuariosPut = async(req, res = response) => {

    const {id} = req.params;
    const { _id, password, google, ...resto } = req.body;

    //TODO validar contra la base de datos
    if (password) {
        const salt = bcryptjs.genSaltSync(10);
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);


    res.json(usuario);
}

const usuariosPatch = (req, res = response) => {
    res.json({
        ok: true,
        msg: "patch api - controlador"
    });
}

const usuariosDelete = async(req, res = response) => {

    const {id} = req.params;

    //Para esta base de datos el usuario siempre va a existir 
    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false});


    res.json(usuario);
}



module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
}