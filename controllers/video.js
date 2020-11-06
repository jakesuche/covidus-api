// var formidable = require('formidable')
var fileSystem = require('fs')
var { getVideoDuration } = require('get-video-duration');
const { request } = require('http');
const Video = require('../models/Video')
const path = require('path')
const fs = require('fs')
const Multer = require('multer');



const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

AWS.config.update({
    accessKeyId: 'AKIAIKNK2EJKQFZYNOXQ',
    secretAccessKey: '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',
    region: 'eu-west-2'
});
let possible = 'abcdefghijklmnopqrstuvwxyz0123456789';

            let vidUrl = `vid`;


            for (i = 0; i <= 6; i++) {
                vidUrl += possible.charAt(Math.floor(Math.random() * possible.length));
            }
const s0 = new AWS.S3({});
let posit

const upload = multer({
    storage: multerS3({
        s3: s0,
        bucket: 'covidus',
        acl: 'public-read',
        metadata: function(req, file, cb){
            cb(null, {fieldName: file.fieldname});
        },
        key: function(req, file, cb){
            cb(null, `${Date.now().toString()}-covidus-video-${vidUrl}${path.extname(file.originalname).toLowerCase()}`);
        }
    }),

    rename: function (fieldname, filename) {
        console.log(filename)
        return filename.replace(/\W+/g, '-').toLowerCase();
        
    }
})

exports.Videoupload = upload;


















// const AWS = require('aws-sdk')
// const multers3 = require('multer-s3')
// const uuid = require('uuid/v4')
// const { Storage } = require("@google-cloud/storage")
// const uuid = require("uuid")
// const uuidv1 =  uuid.v1

// // STORAGE_PRIVATE_KEY = -----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC+PKEGfsXPAImF\nfjV3zcYA7vllutsf4POP2gmof+F22qC1IPumIPfc2b1VlXgJxiUU6LIn6VKxjdcz\n3Vz0kWp5Nze2JMzP/4w1QV8ivZ90WOqXhs53Wc2Fw9Gq/ZeR3UcLKbweeN80fLHC\nYRNYIVEqxgW4AMEBD0nsKuhAYXJtAcdPvB2n/Fr5N57AwEcgYzFwFLKhV3D/5led\nGPN329iBk85Snma3IySI5y7Hu4pSg8tkr5FQVd5+wg9xDua6F3EYRraWhEt9mYSj\neJZQmbmxNpYuiNNOl3FwlDFfSF7woAvT7B2hhwgknNLYazE8kFyxd94Y7QQI1TMd\nOWLOTFffAgMBAAECggEAU8k/QK2YMLYzW5y9LuFt+l5GcMROG2nHzE1DYLfGFUNw\ncaYvv7kYgehSp/2Xa3KeRWnBgauVdMcch+bQuJTNWMr1mh72KAwM9C2xGYt7zdIV\nrJw+ljlyuB4JW+6qEZ/sWOHOTXt+D092OT7pNrEh3x1tSl/mobFapQ420Zg5vgE9\naeNW19NvOeaLba6mUYPE67MrV3no0TOJFdZk77jgrqRVsNnWPh/WH6WZhnDZHxdZ\nvl/2LoWIYJ0/8jkWR1HKy9L+8JQ5j+14swohv/gj+Q8NBb1G0kc/l0e3e44Bj9M8\nreI1gkM6jsHCm8eLdLZpHc6bMds9RNiJpRku+m56AQKBgQD24RbgRVv2sr0wgXRP\nmesUM6S8mMtrDD1QeBqHZqnIevbJ4C8d3Dxh3GV58AHefurZyITnkEOJ4d5OuKmG\n6i0Cb4iPKR5MCJ9Q/e85wSWSFnQGSZY+gDNovRrqEWdCnz7khZbN7BtqrtUyr79o\nRUjOSBAjcEVnk3OaDaeJ2qw93wKBgQDFQ9UalzH57sZES3Sa0gBg5Mr3PQAm1Asi\ncKfahDzCbjid9rmP1ZDkjJtzoNzT1LFpFAeblisBSp6UDBjdl/FU0pj6JnnOO4Th\nkpN6gpp92F0ygDuSpEVpEBKQYxOPoCbLmWSO5FFTDtWNGnmMfFsi3S8VKJ8/HsE3\nBp0Pya8mAQKBgGkWrX8v5xKfSQsxv8n2keuahCBHxic+IYd0aI6Ec/dD6HNMe6Hx\nUr6xa3y5XoJQcjXcNj6/2RADVncaAgfM/PXRdkbCUQQ6k16NiVyDTDPgXOkkP9FB\nDyEhhihm2haw5Luv5d6oB4+k9lnKF+cRvwkYAc6kBtctHANSlqOGstTvAoGAVKZO\nHVICTSkshYQHrqQtK2civcO8e+0ENiw3q2qRlDGuNAL7EADqY1j/IDhIatJbqybA\nOQDQxYYa1Jb4WKbqFaclpDq8jEY4OIAoryq6VwRwwcoLRlsduf7+qF0LuNdVrorN\nfw/04fp8o0dYH3QBu81EdgTviSuOaCl7XpoCggECgYB3nh7rMuySbliQtjEXh8wt\nCK1fh62o71LaNJkDH6QKu7s+MxsdQCx/pY618O9Ow0ewCRHk17XiFlbkO9042N+q\nbES+92CEGhqR4iZj+RA9dcYLFzuNHs3TFktMJgn1cWwXiuBXVTrVsygbDBu8eNBT\n7vPv6ErWLzCDuN63w6BytA==\n-----END PRIVATE KEY-----\n
// // STORAGE_EMAIL = covidus-877@cloud-functions-289612.iam.gserviceaccount.com
// // STORAGE_KEY_ID = cb16b601f343eab16c9424509b251270d5861e42
// // GLOUD_STORAGE_BUCKET= covidus-jake


// const storage =new Storage({projectId:process.env.PROJECT_ID,credentials:{client_email: process.env.STORAGE_EMAIL,private_key:process.env.STORAGE_PRIVATE_KEY.replace(/\\n/gm, '\n')} })
    
// const multer = Multer({
//     storage:Multer.memoryStorage(),
//     limits: {
//         fileSize: 20 * 1024 * 1024
//     }
// })

// const bucket = storage.bucket(process.env.GLOUD_STORAGE_BUCKET)


// module.exports = {

//     

//     videoupload: function (req, res) {
//         function saveImage() {
//             let possible = 'abcdefghijklmnopqrstuvwxyz0123456789';

//             let vidUrl = `vid`;


//             for (i = 0; i <= 6; i++) {
//                 vidUrl += possible.charAt(Math.floor(Math.random() * possible.length));
//             }


//             // to check if there is image with equivalent with the one been uploaded

//             Video.find({
//                 'filename': {
//                     $regex: vidUrl
//                 }
//             }, function (err, video) {
//                 if (err) {
//                     throw err;
//                 }
//                 if (video.length > 0) {
//                     saveImage();
//                 } else {
//                     console.log(req.body)
//                     let temPath = req.file.path; // to get the specific file
//                     console.log(temPath)
//                     let ext = path.extname(req.file.originalname).toLowerCase(); // to get the specific extension
//                     let targetPath = path.resolve('./public/upload/' + vidUrl + ext); // stores all the files permanently in this location

//                     if (ext == '.m4p' || ext == '.m4v' || ext == '.ogg' || ext == '.mpeg' || ext == '.mp4' || ext == '.mp3') { // helps to move a file from one location to another
//                         fs.rename(temPath, targetPath, function (err) {
//                             if (err) {
//                                 throw err;
//                             }

//                             // to save the images to the data base 
//                             // create a new instance with image model and pass an object to it

//                             let video = new Video({
//                                 filename: vidUrl + ext,
//                                 title: req.body.title,
//                                 filename: vidUrl + ext, /// requesting the title from the body handlebar
//                                 description: req.body.description,
//                                 filePath:targetPath,
//                                 user_id:req.user,
//                                 caption:req.body.caption
//                                 // the user has been tied to th 

//                             });

//                             video.save(function (err,data) {
//                                 if (err) {
//                                     throw err;

//                                 }else{

//                                     User.update({_id:req.user},{
//                                         $push:{
//                                             "myVideos": {
//                                                 _id:data._id,
//                                                 content:req.body.description,
//                                                 filename:vidUrl + ext,
//                                                 title:req.body.title,
//                                                 caption:req.body.caption
//                                             }
//                                         }
//                                     },function(err,success){
//                                         if(err){
//                                             console.log('err for push', err)
//                                         }else{
//                                             console.log(success)
//                                             User.updateOne({_id:req.user},{
//                                                 $push:{"notifications":{
//                                                     message:'Your video was uploaded successfully'
//                                                 }},
//                                                 $inc:{totalnotification:1}
//                                             },function(err,data){
//                                                 if(err){
//                                                     console.log('error for increment' ,err)
//                                                 }else{
//                                                     console.log(data)
//                                                 }
//                                             })
//                                         }
//                                     })
//                                     res.status(200).send({message:"Video uploaded successfully"})
//                                 }


//                             })


//                         });

//                     } else {
//                         fs.unlink(temPath, function (err) {
//                             if (err) {
//                                 throw err;
//                             }

//                             res.status(405).json({
//                                 message: 'Invalid image formate'
//                             });
//                         }); // deletes file

//                     }
//                 }
//             })






//             console.log(vidUrl)


//         }

//         saveImage();

//     }


// }

    // videoupload:function(req,res){
    //     // if(req.session.user){
    //         var formData = new formidable.IncomingForm();
    //         formData.maxFileSize = 1000 * 1024 * 1024;
    //         formData.parse(request, function(error, fields, files){

    //            var title = fields.title;
    //             var description = fields.description;
    //             var tags = fields.title;
    //             var category = fields.category

    //             var oldPathThumbnail = files.thumbnail.path;
    //             var thumbnail = "public/thumbnails" + new Date().getTime() + "-" +files.thumbnail.name

    //             fileSystem.rename(oldPathThumbnail, thumbnail, function(error){




    //             var oldPath = files.video.path;
    //             var  newPath = "public/videos/" + new Date().getTime() + "_" + files.video.name;
    //             fileSystem.rename(oldPath, newPath,function(err){
    //                 if(err){
    //                     console.log(err)
    //                 }
    //                 getUser(req.user._id, function(user){
    //                     var CurrentTime = new Date().getTime()

    //                     getVideoDuration(newPath).then(function(duration){
    //                         var hours = Math.floor(duration / 60 /60);
    //                         var minutes = Math.floor(duration / 60) - (hours * 60);
    //                         var seconds = Math.floor(duration % 60);


    //                         var vidos = new Videos()
    //                         videos.title = req.body.title
    //                         vidos.caption = req.body.caption
    //                         vidos.filePath = newPath
    //                         videos.watch = CurrentTime
    //                         videos.seconds = seconds
    //                         videos.thumbnail = thumbnail

    //                         video.save(function(err,data){
    //                             if(err){
    //                                 console.log("video saving", err)
    //                             }else{
    //                                 User.updateOne({
    //                                     _id:req.user._id
    //                                 },{
    //                                     $push:{
    //                                         "videos":{
    //                                             _id:data._id,
    //                                             title:title,
    //                                             views:0,
    //                                             thumbnail,
    //                                             watch:currentTime
    //                                         }
    //                                     }
    //                                 })
    //                             }
    //                             // res.redirect('/')
    //                             res.writeHead(200,{'content-type':'video/audio'})

    //                         })
    //                     })
    //                 })

    //             })
    //         });


    //         });

    //     // }else{

    //     //     res.redirect('/login')

    //     // }
    // }




