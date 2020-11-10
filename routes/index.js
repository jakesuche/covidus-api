var express = require("express");
var router = express.Router();
const signup = require("../controllers/signup");

var formidable = require("formidable");
var fileSystem = require("fs");
var { getVideoDuration } = require("get-video-duration");
const { request } = require("http");
var path = require("path");
const os = require("os");
const { contact }= require("../controllers/contact");
const passwordReset = require("../controllers/forgotPass");
const {
  forgotPassword,
  resetPassword,
  resetpassword1,
} = require("../controllers/forgotPass");
const isActive = require("../controllers/isActive");
const { verify } = require("../controllers/verifyAccount");
const isLogged = require("../controllers/isLogged");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { videoupload } = require("../controllers/Videouploadmiddle");
const aws = require("../controllers/video");
const sgMail = require('@sendgrid/mail');
// const Multer = require('multer')

// const multer = Multer({
//     storage:Multer.memoryStorage(),
//     limits: {
//         fileSize: 20 * 1024 * 1024
//     }
// })

// root route
router.get('/sendmessage', function(req,res){

})

router.get("/", function (req, res) {
  Video.find({})
    .limit(12)
    .exec(function (err, videos) {
      if (err) {
        return res.status(404).send(err);
      } else {
        let data = {
          title: "covidus-covid 19 travelling guide for travellers ",
          videos: videos,
          message: req.flash("loginError"),
        };
        
        if (process.env.NODE_ENV === 'production') {
          res.sendFile(__dirname + "/home.html");
        }else{
          res.render('login')
        }

        
      }
    });
  //  res.status(200).json({title:'welcome to covidus'})

  // res.status(200).send(data)
});


router.get("/getvideos", function (req, res) {

const CurrentPage = parseInt(req.query.currentPage) || 1;
  const limit = parseInt(req.query.limit) || 12;

  Video.find({})
  .populate('user')
  .sort({timeStamp:-1})
    .skip(limit * CurrentPage - limit)
      .limit(limit)
    .exec(function (err, videos) {
      Video.countDocuments(function(err,count){
        if (err) {
            return res.status(404).send(err);
          } else {
            let data = {
              title: "covidus-covid 19 travelling guide for travellers ",
              counts:videos.length,
            //   currentPage:CurrentPage,
            //   pages:Math.ceil(count/limit),
              data:videos
            };
    
            res.status(200).json({sucess: true ,data});
            
          }
        });
      })
  //  res.status(200).json({title:'welcome to covidus'})

  // res.status(200).send(data)
});


router.get("/getmoreVideos",  function (req, res) {
    const CurrentPage = parseInt(req.query.currentPage) || 1;
  const limit = parseInt(req.query.limit) || 12;

  Video.find({})
  .sort({timeStamp:-1})
    .skip(limit * CurrentPage - limit)
      .limit(limit)
    .exec(function (err, videos) {
      Video.countDocuments(function(err,count){
        if (err) {
            return res.status(404).send(err);
          } else {
            let data = {
              
              counts:videos.length,
              currentPage:CurrentPage,
              pages:Math.ceil(count/limit),
              data:videos
            };
    
            res.status(200).json({sucess: true ,data});
            
          }
        });
      })
  });

//infotmation about travelling restriction in a country
router.get("/covid-info", function (req, res) {
  // var limit = parseInt(req.query.limit)
  // console.log(req.query)
  const CurrentPage = parseInt(req.query.currentPage) || 1;
  const limit = parseInt(req.query.limit) || 30;

  var MongoClient = require("mongodb").MongoClient;
  var url = process.env.MONGODB_URI;

  MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db("covidus");
    dbo
      .collection("covidGuide")
      .find({})
      .skip(limit * CurrentPage - limit)
      .limit(limit)
      .toArray(function (err, result) {
        dbo.collection("covidGuide").countDocuments(function (err, count) {
          if (err) {
            console.log(err);
          }

          res.status(200).send({
            counts: result.length,
            currentPage: CurrentPage,
            pages: Math.ceil(count / limit),
            data: result,
          });
          db.close();
          // console.log(result);
        });
      });
  });
});

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
router.get("/searchCovidInfo", function (req, res) {
  // var search = req.params.search
  var noMatch = null;
  const regex = new RegExp(escapeRegex(req.query.search), "gi");
  var MongoClient = require("mongodb").MongoClient;
  var url = process.env.MONGODB_URI;

  MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db("covidus");
    dbo
      .collection("covidGuide")
      .find({ adm0_name: regex })
      .toArray(function (err, result) {
        if (err) {
          console.log(err);
        } else {
          if (result.length < 1) {
            noMatch = "No Match for this query, please try again";
          }
          res.send({ result: result, noMatch: noMatch });
          db.close();
          // console.log(result);
        }
      });
  });
});

// router.post('/login',passport.authenticate('local-login',{
//     'successRedirect':'/user',
//     'failureRedirect':'/',
//     "failureMessage":true

// }))
router.post("/login", signup.login);

router.get("/user", isLogged, function (req, res) {
  Video.find({}).exec(function (err, videos) {
    if (err) {
      res.status(500).send({ message: "internal server error" });
      console.log(err);
    } else {
      console.log(req.user, "kgjhghhjhgjh");
      User.findById({ _id: req.user }, function (err, user) {
        if (err) {
          console.log(err);
        } else {
          res.send({
            user: user,
            videos: videos,
          });
        }
      });
    }
  });
});

// route for more videos

// login and authentication
router.get("/login", function (req, res) {
  res.status(200).json({ title: "User login page" });
});

router.get("/share-story", function (req, res) {
  res.status(200).json({ title: "Share your covid-19 story" });
});
// post route  for  video file upload
router.post("/postVideo",  aws.Videoupload.any(),  async function (req, res) {
    try{
        let video = new Video({
            title: req.body.title,
            Uploader: req.user,
            caption: req.body.caption,
            country: req.body.country,
            videoUrl: req.files[0].location
        })

        video.save(function (err) {
            if (err) {
              console.log(err.message);
            } else {
              User.updateOne(
                { _id: req.user },
                {
                  $push: {
                    myVideos: {
                      videoUrl: req.files[0].location,
                      title: req.body.title,
                      caption: req.body.caption,
                    },
                  },
                },
                function (err, result) {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log(result);
                    res.status(200).send({ message: "Video uploaded successfully" });
                  }
                }
              );
            }
          });



    }catch(err) {
        res.status(400).send({message:'Please add a video file'})
        console.log(err)

    }

 });
 router.post('/contact/sendMessage', contact)


// route  for reset password
router.post("/forgot", forgotPassword);
router.get("/passwordreset/:token", resetPassword);
router.post("/passwordreset/:token", resetpassword1);
// post router for signing up account
router.post("/signup", signup.signup);

// get route for facebook auth
router.get("/auth/facebook", signup.facebookAuth);
router.get("/auth/facebook/callback", signup.callback);

// get route for google auth
router.get("/auth/google", signup.googleAuth);
router.get("/auth/google/callback", signup.googleCallback);

// twitter authentication
router.get("twiiter/auth", signup.twitterAuth);
router.get("/auth/twitter/callback", signup.twitterCallBack);

// post route  for  video file upload

// route for contact
router.get("/contact", function (req, res) {
  res.status(200).json({ title: "contact" });
});

// router.post("/contact", controller.contact);

// password reset
router.post("/forgot", forgotPassword);
router.get("/passwordreset/:token", resetPassword);
router.post("/passwordreset/:token", resetpassword1);

// Account verification
router.get("/activate/:token", verify);

module.exports = router;
