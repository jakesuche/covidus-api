
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const _ = require('lodash')
const bcyrpt = require('bcrypt')
const crypto = require('crypto')
const async = require('async')

const hbs = require('nodemailer-express-handlebars')
const hogan = require('hogan.js')
const fs = require('fs')
const template = fs.readFileSync('./controllers/template/changepassword.handlebars','utf-8')
const sgMail = require("@sendgrid/mail")
var compileTemplate = hogan.compile(template)


module.exports = {

    forgotPassword: function (req, res) {
        async.waterfall([
            function (done) {
                crypto.randomBytes(100, function (err, buff) {
                    var token = buff.toString('hex')
                    done(err, token)
                })
            },
            function (token, done) {
                User.findOne({ email: req.body.email }, function (err, user) {
                    if (!user) {
                        return res.status(400).json({ error: "No account With the email address" })
                    }

                    user.resetPasswordToken = token;
                    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                    user.save(function (err) {
                        
                        done(err, token, user)
                    })
                })
            },
            function (token, user, done) {
                
                if(process.env.NODE_ENV ==='production'){
                  const link = `https://covidus1.herokuapp.com/passwordreset/${token}`
                  console.log('first from  production')
                }
                const link = `${process.env.CLIENT_URL}/passwordreset/${token}`

                console.log(link)
                const welcome = `We're excited to have you get started. First, you need to confirm your account. Just press the button below.`
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                var msg = {
                    from:'Covidus 📧 <uchechidi9@gmail.com>',
                    to:req.body.email,
                    subject:'Password Reset',
                    html:compileTemplate.render({name:user.name,link:link})
                    
                  // html:`pls click on the link to activate your account <a href="http://localhost:4000/activate/${token}></a>`,

                }
                console.log(user.name)
                sgMail.send(msg, function(err,info){
                    if(err){
                        console.log(err)
                        return res.status(400).json({message:'Error in send email'})

                    }else{

                        console.log(info)
                        res.status(200).json({message:'An Email Has Been Sent With Instructions On How To Reset Pour Password',token:token})

                    }
                })
               

            }
        ], function (err) {
            if (err) {
                return console.log(err)
            } res.redirect('/')
        })

    },
    resetPassword: function (req, res) {
        console.log('reset token',req.params.token)

        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {

            if (!user) {
                res.json({ error: 'password rest token is invalid' })
            } if (user) {
                   
                if (process.env.NODE_ENV === 'production') {
                    console.log('This is from production')
                    res.status(201).json({token: req.params.token})
                  }else{
                    res.render('login')
                  }

            }
        })


    },
    resetpassword1: function (req, res) {

        async.waterfall([
            function (done) {
                User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
                    if (!user) {
                        res.json({ error: "password reset token is invalid" })
                    } if (user) {
                        if (req.body.password === req.body.password2) {
                            if (user) {
                                user.password = user.encryptPassword(req.body.password)
                                user.resetPasswordToken = undefined;
                                user.resetPasswordExpires = undefined;
                                console.log(req.body.password + user.password, 'a messafeooooo')

                                user.save(function (err) {
                                    done(err, user,)
                                    res.redirect('/')
                                })

                            } else {
                                res.json({ error: "password does not march" })
                            }
                        }

                    }
                })
            },
            function (user, done,) {
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                var msg = {
                    from:'Covidus 📧 <uchechidi9@gmail.com>',
                    to:req.body.email,
                    subject:'Password Reset',
                    html:compileTemplate.render({name:user.name})
                    
                   // html:`pls click on the link to activate your account <a href="http://localhost:4000/activate/${token}></a>`,

                }
                console.log(user.name)
                sgMail.send(msg,function(error, info){
                    if(error){
                        return console.log(error)
                    }
                    console.log(info)
                    res.json({message:'Password changed successfully'})
                    done(error)
                })
               

            }
        ])
    }

}
    // forgotPassword:function(req,res){
    //     const email = req.body.email

    //     user.findOne({email:email}, function(err,user){
    //         if(!user){
    //             res.json({message:'user does with the email does not exist'})
    //         }if(user){
    //             const token = jwt.sign({_id:user._id}, process.env.RESET_PASSWORD_KEY,{expiresIn:"20m"})
    //             const data = {
    //                 from: 'noreply@covidus.com',
    //                 to:email,
    //                 subject:'Password reset link',
    //                 html:`
    //                     <h2> Please click on the link to reset your password</h2>
    //                     <p2>${process.env.CLIENT_URL}/passwordreset/${token}
    //                 `
    //             };

    //             return User.updateOne({resetLink:token},function(err,success){
    //                 if(err){
    //                     return res.status(400).json({error:'reset passowrd link error'})
    //                 }else{

    //                     var transport = nodemailer.createTransport(config.mailer)

    //                         transport.sendMail(data,function(error, info){
    //                             if(error){
    //                                 return console.log(error)
    //                             }
    //                             console.log(info)
    //                             res.status(200).json({message:`An email has been sent to ${email}, kindly reset your `})
    //                         })

    //                 }
    //             })

    //         }
    //     })
    // },
    // resetPassword:function(req,res){
    //     const {resetLink, newPass} = req.body
    //     if(resetLink){
    //         jwt.verify(resetLink,process.env.RESET_PASSWORD_KEY, function(error, decodeData){
    //             if(error){
    //                 return res.status(401).json({
    //                     error:"Incorrect token or it has expired"
    //                 })
    //             }else{
    //                 User.findOne({resetLink:resetLink}, function(error,user){
    //                     if(error || !user){
    //                         return res.status(400).json({error:'user with the token does not exist'})
    //                     }
    //                     const objs = {
    //                         passowrd: newPass
    //                     }

    //                     user = _.extend(user,object)
    //                     user.save(function(err,result){
    //                         if(err){
    //                             return res.status(400).json({error:"reset password error"})
    //                         }else{
    //                             return res.status(200).json({message:"Your password has been change"})
    //                         }
    //                     })




    //                 })
    //             }
    //         })
    //     }else{
    //         return res.status(401).json({error:'authentication failed'});

    //     }
    // }



