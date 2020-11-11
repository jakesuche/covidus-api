
const hogan = require("hogan.js");
const fs = require("fs");
const template = fs.readFileSync(
  "./controllers/template/sendMessage.hbs",
  "utf-8"
);
var compileTemplate = hogan.compile(template);


module.exports = {
  contact: function (req, res) {
    req.checkBody("name", " Name field cannot be empty").notEmpty();
    req.checkBody("country", "Email cannot be empty").notEmpty();
    req.checkBody("email", "Please enter a valid Email Address").isEmail();
    req.checkBody("email", " Name field cannot be empty").notEmpty();
    req.checkBody("phone", "please enter a valid data").notEmpty();
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
            res.json({ message: `You previously sent us a message with ${req.body.email}. Please choose a different email or wait till we attend to your request` });
          } else {
            let contact = new Contact({
              name: req.body.name,
              country: req.body.country,
              email: req.body.email,
              phone: req.body.phone,
              reason: req.body.email,
              evidence: req.body.email,
            });

            contact.save(function (err, user) {
              if (err) {
                console.log(err);
              } else {
                var userEmail = req.body.email;
                var link = `https://covidus.netlify.app`
                const message = `We Have recieved Your Request For Covid-19 test fee, Please Note That This Request Is Only Made Once, We Will Attend Your Message As Soon As Possible, We Thank You For Getting In Touch`
                // global.sendGrid = require('@sendgrid/mail')

                // sendGrid is a global variable ..from configure.js
                sendGrid.setApiKey(process.env.SENDGRID_API_KEY);

                const msg = {
                  to: req.body.email,
                  from: " Covidus <uchechidi9@gmail.com>", // Use the email address or domain you verified above
                  subject: "THANK YOUR FOR CONTACTING US ",
                  text: "and easy to do anywhere, even with Node.js",
                  html: compileTemplate.render({
                    name: user.name,
                    link:link,
                    message:message
                  }),
                };
                setTimeout(function () {
                 sendGrid.send(msg, function(err, info){
                   if(err){
                     console.log(err)
                     res.status(400).send({message:'Error in sending message'})
                   }else{
                     console.log(info)
                    res.status(200).json({
                       
                      message:"Thank you for contacting us .."
                    })
                   }

                    
                   
                 })
                }, 10000);
              }
            });
          }
        }
      );
    }
  },
};


