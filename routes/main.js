var express = require('express');
var router = express.Router();
let passport = require('passport')
let auth = require('../controllers/Authentication');
let sessionHelper = require('../models/session');
let user = require('../models/usuario');
const { check, validationResult } = require('express-validator');


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/login', auth.isLogged, passport.authenticate('local'), function(req, res){
    console.log(req.session)
    res.json({mensaje: "Logged in con éxito.", status: 200})
});

router.get('/logout', auth.isAuth, function(req, res){
    req.logout();
    res.json({mensaje: "Logged out con éxito.", status: 200})
})


router.post('/registrar', 
    check('email').custom(value => { return user.checkingEmail(value).then(user =>{if(user){ return Promise.reject('Correo en existencia.'); } } )}),
    check('username').custom(value => { return user.getUserByUsername(value).then(user =>{if(user){ return Promise.reject('Nombre de usuario en existencia. Intente con uno diferente.'); } } )}),
    auth.isLogged, function(req, res){

    const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array()  })
    }

    user.registrar(req.body).then((result)=>{
            let count = result.rowCount;
            let status, mensaje;
            if(count > 0){
                let codigo = Math.floor((Math.random() * 999999) + 100000);
                let codigo_usuario;

                user.getUserByUsername(req.body.username).then((result)=>{
                        codigo_usuario = result.id_usuario;

                        user.correoTemporal(codigo_usuario, codigo).then((result)=>{
                        sessionHelper.enviarCorreo(req.body.email, codigo);
                        status = 200;
                        mensaje = "Usuario Registrado :).";
                        }).catch(err => {
                            console.log(err);
                            res.status(500).json({status: 501, mensaje: 'Error al Enviar Código :(.'});
                        }); 
                }).catch(err => {
                    console.log(err);
                    res.status(500).json({status: 505, mensaje: 'Usuario no encontrado :(.'});
                }); 
            }else{
              status = 502;
              mensaje = 'Error al registrar Usuario :(.'
              }
          res.json({status, mensaje})
          }).catch(err => {
            console.log(err);
            res.status(500).json({status: 500, mensaje: 'Error grave al Registrar :(.'});
        }) 
});







router.get('/articulos', (req, res) => {
let message, status;

if(req.session.user){

user.articulosMostrar(sessionHelper.getIdFromSession(req)).then((tipo) => {
    console.log(tipo)
        if(tipo === 3){
            user.articulosMostrarVendedor(sessionHelper.getIdFromSession(req))
            .then((data) => {
            message = "artículos desplegado para vendedor :).";
            status = 200;
            res.json({tipo, data, message, status});
            }).catch(err => {
                console.log(err)
                message = "artículos desplegados :).";
                status = 200;
                res.json({tipo, status: 508, message: 'Error al cargar los artículos de este vendedor.'})  
            })

        }else{

            user.articulosMostrarCliente()
            .then((data) => {
            message = "artículos desplegados para cliente :).";
            status = 200;
            res.json({tipo, data, message, status});
            }).catch(err => {
                console.log(err)
                message = "artículos NO desplegados :(.";
                status = 200;
                res.json({tipo, status: 508, message: 'Error al cargar los artículos de este cliente.'})  
            })
        }

    }).catch(err => {
        console.log(err)
        res.json({tipo: 0, status: 500, message: 'Error al cargar los artículos.'})  
    })


}else{
    user.articulosMostrarCliente().then((data) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({status: 200, tipo: 0, data: data, message: "artículos desplegados para cliente :)."});
    }).catch(err => {
        console.log(err)
        res.json({tipo: 0, status: 508, message: 'Error al cargar los artículos de este cliente.'})  
    })        
}
})


router.post('/articulo/crear', auth.isAuth, (req, res) => {
    user.notaCrear(req.body, sessionHelper.getIdFromSession(req)).then((result) => {
        res.json({status: 200, message: 'Artículo creado :).'})
    }).catch(err => {
        console.log(err)
        res.json({status: 500, message: 'Error al crear artículo :(.'})
    })
})




router.get('/departamento', (req, res) => {
    user.departamentoMostrar().then((data) => {
        let message, status;
        if(data !== null){
            message = "departamentos desplegados :).";
            status = 200;
        }else{
            message = "departamentos NO desplegados :(.",
            status = 404;
        }
        res.json({data, message, status});
    }).catch(err => {
        console.log(err)
        res.json({status: 500, message: 'Error al enviar departamentos.'})
    })
})


































router.delete('/notas/:id/borrar', auth.isAuth, (req, res) => {
    user.notaBorrar(req.params.id, sessionHelper.getIdFromSession(req)).then((result) => {
        res.json({status: 200, message: 'Nota borrada :).'})
    }).catch(err => {
        console.log(err)
        res.json({status: 500, message: 'Error al borrar nota :(.'})
    })
})

router.get('/nota/:id', auth.isAuth, (req, res) => {
    user.notaMostrar(req.params.id).then((data) => {
        let message, status;
        if(data !== null){
            message = "Nota desplegada :).";
            status = 200;
        }else{
            message = "Nota inexistente :(.",
            status = 404;
        }
        res.json({data, message, status});
    }).catch(err => {
        console.log(err)
        res.json({status: 500, message: 'Error'})  
    })
})


router.put('/nota/:id/editar', auth.isAuth, (req, res) => {
    user.notaEditar(req.body, req.params.id, sessionHelper.getIdFromSession(req)).then((result) => {
        res.json({status: 200, message: 'Nota modificada :).'})
    }).catch(err => {
        console.log(err)
        res.json({status: 500, message: 'Error al modificar nota :(.'})
    })
})




module.exports = router;
