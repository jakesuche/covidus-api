const nodemailer = require("nodemailer");
let { SMPTCleient }= require('emailjs')

module.exports = {
  contact: function (req, res) {
    req.checkBody("name", " Name field cannot be empty").notEmpty();
    req.checkBody("country", "Email cannot be empty").notEmpty();
    req.checkBody("email", "Please enter a valid Email Address").isEmail();
    req.checkBody("email", " Name field cannot be empty").notEmpty();
    req.checkBody("number", "please enter a valid data").notEmpty();
    req.checkBody("reason", "Email cannot be empty").notEmpty();
    req.checkBody("evidence", "field cannot be empty").notEmpty();

    var errors = req.validationErrors();

    if (errors) {
      res.json(errors);
      console.log(errors);
    } else {
      Contact.findOne(
        { email: req.body.email } || { number: req.body.number },
        function (err, data) {
          if (err) {
            res.send(err);
          }
          if (data) {
            res.json({ message: "You only send request ones" });
          } else {
            let contact = new Contact({
              name: req.body.name,
              country: req.body.country,
              email: req.body.email,
              phone: req.body.phone,
              reason: req.body.email,
              evidence: req.body.email,
            });

            contact.save(function (err, data) {
              if (err) {
                console.log(err);
              } else {
                var userEmail = req.body.email;
                var transport = nodemailer.createTransport({
                  host: "smtp.mailtrap.io",
                  port:2525,
                  auth: {
                    user: "2a6f827a372487",
                    pass: "80800cb52a886f",
                  },
                });
                var mailOptions = {
                  from: "Covidus <noreply@covidus.com>",
                  to: userEmail,
                  subject: "contact",
                  html: "Thank you for contacting us",
                };
                setTimeout(function () {
                  transport.sendMail(mailOptions, function (error, info) {
                    if (error) {
                      return console.log(error);
                    }else{
                      res.send({message:'Massage sent'})
                    }
                    
                  
                    
                    // console.log(info);
                    // res.json({ message: "Email sent" });
                  });
                }, 10000);
              }
            });
          }
        }
      );
    }
  },
};
