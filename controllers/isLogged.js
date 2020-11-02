
const { promisify } = require('util')
const jwt = require('jsonwebtoken')


module.exports =function(req,res,next){
    let token
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
    }
    if(token == null){
        return res.status(401).send({message:'please login'})
    }
    jwt.verify(token, process.env.JWT_SECRET, function(err,data){
        if(err){
            res.status(400).send({message:`${err.message}, pls login again to have access`})
            console.log(err.message)
        }else{
            console.log(data)
            req.user = data.id
            req.token = token
           
            next()
        }
        
        
    })

}