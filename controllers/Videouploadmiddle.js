
const formidable = require('formidable')
const fs = require('fs')
const path = require('path')



module.exports = {
    videoupload:function(req,res){
        const form = new formidable.IncomingForm();
        //form.uploadDir = path.join(__dirname,'../public/upload');
    
        form.on('file',(field,file)=>{
            console.log(file )
            // fs.rename(file.path, path.join(form.uploadDir, file.name) ,(err)=>{
            //     if(err){
            //         console.log(err)
            //     }
            //     console.log('file rename')
            // })
        })
        form.on('error',(err)=>{
            console.log(err)
        })
        form.on('end', ()=>{
            console.log('file uploader')
            res.send('uplaoded')
        })
        form.parse(req);
    
    
    
    }
}