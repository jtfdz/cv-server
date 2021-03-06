var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var expressValidator = require('express-validator');
var passport = require('passport');
var logger = require('morgan');
var mainRouter = require('./routes/main');
let usuario = require('./models/usuario');
var app = express();
var cors = require('cors');



app.use(logger('dev')); //  formato_ Concise output colored by response status for development use.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({
  //methods: "GET,PUT,POST,DELETE",
  credentials: true,
  //optionsSuccessStatus: 200,
  origin: true,
  //preflightContinue: false
  }));


// app.use(function(request, response, next) {
//   //response.header("Access-Control-Allow-Origin", "*");
//   response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
//   response.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
//   //response.header("Access-Control-Allow-Credentials",true);
//   next();
// });


// app.use(cors());

app.use(session({
  secret: 'fajoq0i943wki09tgd',
  saveUninitialized: true,
  resave: true,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}));





app.use(passport.initialize());
app.use(passport.session());

// app.use((req, res, next) => {
//   var status = req.isAuthenticated() ? 'logged in' : 'logged out';
//   console.log(
//     'status:', status, '\n',
//     req.sessionStore,
//     req.sessionID,
//     req.session
//   );
//   next();
// });


passport.use(require('./models/strategy'));


passport.serializeUser(function(user, done){
    done(null, {id_usuario: user.id_usuario})
})

passport.deserializeUser(function(serializedUser,done){ 
    usuario.getUserById(serializedUser.id_usuario).then((user) => {
        done(null, user);
    })
})



app.use('/', mainRouter);


module.exports = app;

