const express = require('express');
const app = express();
const path = require('path')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({ path:'./config.env'});
const configure = require('./server/configure')


// MONGO DB ENVIRONMENTAL VARIABLE
const DB = process.env.MONGODB_URI

// DATABASE CONNECTION WITH MONGOOSE
mongoose.connect(DB,{useNewUrlParser:true,useUnifiedTopology:true});
mongoose.connection.on('error', console.error.bind(console, 'Database connection Error')); /// handling the error
mongoose.connection.once('open', function(){
    console.log('connected to Database');
})

app.use(function(req,res,next){
    Video.find({}).populate('Uploader').exec(function(err,data){
        // console.log(data,'text i dddddjdjd')
    })
    next()
})
app.use(function (err, req, res, next) {
    console.error(err.stack)
    console.log(req.err)
    res.status(500).send('Something broke!')
})

const port = app.get('port')

app.listen(process.env.PORT || 5000, function () {
    console.log(`app listening at port:${5000} `)
})



const fs = require('fs')
const file = fs.readFileSync('./controllers/template/email.handlebars','utf-8')
app.set('views', __dirname + '/views' )
configure(app)




// APP LISTENING AT PORT:4000









   
