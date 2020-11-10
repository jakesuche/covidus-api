const nodemailer = require("nodemailer");
const passport = require("passport");

const facebookStrategy = require("passport-facebook").Strategy;
const userSchema = require("../models/user");
const crypto = require("crypto");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");
const hogan = require("hogan.js");
const fs = require("fs");
const template = fs.readFileSync(
  "./controllers/template/email.handlebars",
  "utf-8"
);
var compileTemplate = hogan.compile(template);
const async = require("async");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail")
// console.log(template)

module.exports = {
  signup: function (req, res) {
    req.checkBody("name", " Name field cannot be empty").notEmpty();
    req.checkBody("email", "Email cannot be empty").notEmpty();
    req.checkBody("email", "Please enter a valid Email Address").isEmail();
    req.checkBody("password", "password is re quired").trim().notEmpty();
    req
      .checkBody("password", "password should at least 8 character")
      .isLength({ min: 8 });

    var message = req.validationErrors();

    if (message) {
      res.status(400).send({ message: message });
    } else {
      userSchema.findOne({ email: req.body.email }, function (err, user) {
        if (err) {
          res.send(err);
        }
        if (user) {
          res.status(404).send({ message: "User already exist" });
        } else {
          crypto.randomBytes(40, function (err, buf) {
            token = buf.toString("hex");

            let newUser = new User();
            newUser.name = req.body.name;
            newUser.email = req.body.email;
            newUser.password = newUser.encryptPassword(req.body.password);
            (newUser.activeToken = token),
              (newUser.activeExpires = Date.now() + 1500000);

            newUser.save(function (err, user) {
              if (err) {
                res
                  .status(401)
                  .send({ message: "error occur while signing up" });
                console.log(err);
              } else {
                User.updateOne(
                  { email: req.body.email },
                  {
                    $push: {
                      notifications: {
                        message: "Account registration successfull",
                      },
                    },
                    $inc: { totalnotification: 1 },
                  },
                  function (err, data) {
                    if (err) {
                      console.log("error for increment", err);
                    } else {
                      const token = jwt.sign(
                        { id: user._id },
                        process.env.JWT_SECRETE,
                        { expiresIn: process.env.JWT_EXPIRATION }
                      );
                      console.log(data);
                      const welcome = `We're excited to have you get started. First, you need to confirm your account. Just press the button below.`
                      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                      const msg = {
                        to: req.body.email,
                        from: " Covidus <uchechidi9@gmail.com>", // Use the email address or domain you verified above
                        subject: "Account Registration Successful",
                        text: "and easy to do anywhere, even with Node.js",
                        html:compileTemplate.render({name:user.name,welcome:welcome}),
                      };
                      sgMail.send(msg, function (err, data) {
                        if (err) {
                          console.log(err);
                        } else {
                          console.log(data);
                          res.status(200).json({
                            message: "Account registered successfully",
                            token,
                            name: user.name,
                            email: user.email,
                          });
                        }
                      });
                    }
                  }
                );

                // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                // const msg = {
                //   to: "uchechidi5@gmail.com",
                //   from: "uchechidi9@gmail.com", // Use the email address or domain you verified above
                //   subject: "Sending with Twilio SendGrid is Fun",
                //   text: "and easy to do anywhere, even with Node.js",
                //   html:
                //     "<strong>and easy to do anywhere, even with Node.js</strong>",
                // };
                // //ES6
                // sgMail.send(msg, function (err, data) {
                //   if (err) {
                //     console.log(err);
                //   } else {
                //     console.log(data);
                //     res.send("sent");
                //   }
                // });

                //

                // const link = `https://covidus1.herokuapp.com/activate/${token}`
                // var transport = nodemailer.createTransport(
                //     {
                //         host: 'smtp.gmail.com',
                //         port: 465,
                //         secure: true,
                //         auth: {
                //             user: process.env.GMAIL_NAME,
                //             pass: process.env.GMAIL_PASS
                //         }
                //     })

                // const welcome = `We're excited to have you get started. First, you need to confirm your account. Just press the button below.`
                // var mailOptions = {
                //     from:'Covidus 📧 <noreply@covidus.com>',
                //     to:req.body.email,
                //     subject:'Account Registration Successful',
                //     html:compileTemplate.render({name:user.name,link:link,welcome:welcome})

                //    // html:`pls click on the link to activate your account <a href="http://localhost:4000/activate/${token}></a>`,

                // }
                // console.log(user.name)
                // transport.sendMail(mailOptions,function(error, info){
                //     if(error){
                //         return console.log(error)
                //     }else{

                //         User.updateOne({email:req.body.email},{
                //             $push:{"notifications":{
                //                 message:'Account registration successfull'
                //             }},
                //             $inc:{totalnotification:1}
                //         },function(err,data){
                //             if(err){
                //                 console.log('error for increment' ,err)
                //             }else{
                //                 console.log(data)
                //             }
                //         })
                //         console.log(info)
                //         res.json({message:'Account registered successfully'})

                //     }

                // })
              }
            });
          });
        }
      });
    }
  },
  login: function (req, res, next) {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).send({ message: "Please provide email and password" });
    } else {
      User.findOne({ email: email })
        .select("+password")
        .exec(function (err, user) {
          // User.findOne({ 'email': email }, function (err, user) {
          if (err) {
            throw err;
          }
          if (!user || !user.checkPassword(password, err)) {
            res.status(401).send({ message: "incorrect email or password" });
          } else {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRETE, {
              expiresIn: process.env.JWT_EXPIRATION,
            });
            res.status(200).send({
              status: "success",
              token,
            });
          }

          //})
        });
    }

    // const user = User.findOne({ email: email }).select('+password')

    // if (!user || !user.checkPassword(password)) {
    //     return res.status(401).send({ message: 'incorrect password' })

    // }
    // User.findOne({ email: email }).select('+password').exec(function (err, user) {
    //    // User.findOne({ 'email': email }, function (err, user) {
    //         if (err) {
    //             throw err;
    //         } if (!user) {
    //             res.status(400).send({message:'incorrect email or password'})
    //         }
    //         if (!user.checkPassword(req.body.password)) {
    //             res.status(400).send({message:'incorrect email or password'})
    //         }else{
    //             const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION })
    //             res.status(200).send({
    //                 status: 'success',
    //                 token,

    //             })
    //         }

    //     //})
    // })
  },

  facebookAuth: passport.authenticate("facebook", {
    scope: "email",
  }),
  callback: passport.authenticate("facebook", {
    successRedirect: "/user",
    failureRedirect: "/login",
  }),
  googleAuth: passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
  googleCallback: passport.authenticate("google", {
    successRedirect: "/user",
    failureRedirect: "/login",
  }),
  twitterAuth: passport.authenticate("twitter", {
    scope: "email",
  }),
  twitterCallBack: passport.authenticate("twitter", {
    successRedirect: "/user",
    failureRedirect: "/",
  }),
};
