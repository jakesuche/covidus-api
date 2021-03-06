
let morgan = require('morgan') // for logging
let path = require('path')
let express = require('express');
let moment = require('moment');
let bodyParser = require('body-parser');
let expressValidator = require('express-validator');
let session = require('express-session');

const passport = require('passport')

const dotenv = require('dotenv')
const mainRoute = require('../routes/index')
const setPassport = require('./passport')
const expressHandlebars = require('express-handlebars')
const multer = require('multer')
const cors = require('cors')
let flash = require('express-flash');
const connection = require('mongoose').createConnection(process.env.MONGODB_URI,{useNewUrlParser:true,useUnifiedTopology:true})
const mongoStore = require('connect-mongo')(session)

const swaggerjsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const swaggerOptions = {
    swaggerDefinition: {
        
        info: {
            title: 'Covidus Api',
            description: 'Covidus Api documentation',
            contact: {
                servers: ["http://localhost:4000"]
            }
        }
    },
    // path to the api docs
    apis: ["./routes/index.js"]
}
const document = require('../swagger.json')


const swaggerDocs = swaggerjsdoc(swaggerOptions)
const sessionStore = new  mongoStore({
    mongooseConnection:connection,
    collection:'session'

})
const expressSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const xssClean = require('xss-clean')
const expressRateLimit = require('express-rate-limit');
const hpp = require('hpp')




module.exports = function(app){



    
    // app.use(morgan('dev')) // logging agent
    app.use(cors())
    dotenv.config({ path:'../config.env'}); // environ variable configuration 
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(bodyParser.json());

    //app.use(multer({dest: './public/upload/temp'}).single('file')); /// enables image uploads
    app.use('/public/', express.static(path.join(__dirname ,'../public'))); 
    app.use(session({
        secret:"covidusapp",
        resave:false,
        saveUninitialized:true,
        store:sessionStore,
        cookie:{
            maxAge:1000 * 60 * 60 * 24,
            
        },
        
    }));
   
    app.use(flash());
    app.use('/public/', express.static(path.join(__dirname ,'../public'))); 
    app.use(passport.initialize());
    app.use(passport.session());
    setPassport()
    app.use(expressValidator())
    app.use(function(req,res,next){
         console.log(req.session)
        next()
    })
  
    global.User = require('../models/user')
    global.Video = require('../models/Video')
    global.Contact = require('../models/contact')
    global.sendGrid = require('@sendgrid/mail')

    // sanitize data  
    app.use(expressSanitize())

    // helmet 
    app.use(helmet())

    // prevent xss attack 
    app.use(xssClean())

    // express rate limitig 
    const limiter = expressRateLimit({
        windowMs:10 * 60 *1000,
        max: 100
    })

    app.use(limiter)

    // prevent http 

    app.use(hpp())
   
    app.use('/',mainRoute)
    app.use('/api',swaggerUi.serve, swaggerUi.setup(document))

    

    // app.all('*',function(req,res,next){
       
    //     const err = new Error(`Cannot find ${req.orinalUrl}on this server`, 404);
    //     next(err)
    // })
    // app.use(function(err,req,res,next){
    //     console.log(err.stack)
    //     err.statusCode = err.statusCode || 500;
    //     err.status = err.status || 'error';

    //     res.status(err.statusCode).json({
    //         status:err.status,
    //         message: err.message
    //     })
    // })

  

    app.engine('handlebars', expressHandlebars.create({
        'defaultLayout':'main',
        'layoutsDir':app.get('views') + '/layouts'
    }).engine)
    // app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'handlebars');


    return app
}


