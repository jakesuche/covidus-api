module.exports = function(req, res, next){
    if(req.isAuthenticated()){
        next()
    }
    else{
        res.status(404).send({message:'You Must Login To Continue'})
    }
}