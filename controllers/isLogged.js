module.exports = function(req, res, next){
    if(req.isAuthenticated()){
        next()
    }
    else{
        res.status(200).send('You Must Login To Continue')
    }
}