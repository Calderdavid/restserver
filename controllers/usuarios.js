const {response} = require('express');

const usuariosGet = (req, res = response) => {
    res.json({
        ok: true,
        msg: "get api - controlador"
    });
}

const usuariosPost = (req, res = response) => {

    // const {nombre, edad} = req.body;

    res.json({
        ok: true,
        msg: "post api - controlador",
        // nombre, edad
    });
}

const usuariosPut = (req, res = response) => {
    res.json({
        ok: true,
        msg: "Put api - controlador"
    });
}

const usuariosPatch = (req, res = response) => {
    res.json({
        ok: true,
        msg: "patch api - controlador"
    });
}

const usuariosDelete = (req, res = response) => {
    res.json({
        ok: true,
        msg: "delete api - controlador"
    });
}



module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
}