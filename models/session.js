var nodemailer = require('nodemailer');

module.exports.getIdFromSession = (req) => {   
    return req.session.passport.user.id_usuario;
}

module.exports.getPaginaIdFromSession = (req) => {
    return req.session.passport.user.id_pw;
}

module.exports.getCurrentTime = () => {
	var now = new Date();
    return now;
}


module.exports.enviarCorreo = (correo, code) => {

let transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
  auth: {
    user: 'comprasventas.noreply@gmail.com',
    pass: 'cavabien0'
  }
});
const message = {
    from: 'comprasventas.noreply@gmail.com', 
    to: correo,         
    subject: '[CV] CÓDIGO DE AUTENTICACIÓN [NO REPLY]', 
    html: '<p>SU CÓDIGO:<b>'+code+'</b></p>'
};
transport.sendMail(message, function(err, info) {
    if (err) {
      return err;
    } else {
      return info;
    }
});
}




