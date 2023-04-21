const jwt = require('jsonwebtoken');
const { response, request } = require('express');

const Usuario = require('../models/usuario');

const validarJWT = async(req, res = response, next) => {
    
    const token = req.header('x-token');

    // console.log(token);

    if(!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        })
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPUBLICKEY);

        //Leer el usuario que corresponde al UID
        const usuario = await Usuario.findById(uid);

        if(!usuario) {
            return res.status(401).json({
                msg: 'Token no válido - usuario no existe en la DB'
            })
        }

        //Verificar si el uid no está marcado o tiene estado: true
        if (!usuario.estado){
            return res.status(401).json({
                msg: 'Token no válido - usuario con estado: false'
            })
        }



        
        req.usuario = usuario;
        next();


    } catch (err) {
        console.log(err);
        res.status(401).json({
            msg: 'Token no válido'
        })
    }


}


module.exports = {
    validarJWT
}