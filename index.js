const nodemailer = require('nodemailer')
const express = require('express')
const multer = require('multer')
const CLIENT_ID = ""; // ID API
const CLIENT_SECRET = ""; //CLIENT_ID API
var bodyParser = require("body-parser")

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)) 
    }
})
  
var upload = multer({ storage: storage }).array('file',100);

const path = require('path')
const PORT = process.env.PORT || 3000 
const app =  express()

app.use(bodyParser.urlencoded({extended:true}));
app.get('/',(req,res)=>{
    res.sendFile(__dirname +"/index.html" )
})


let paths = []

app.post('/sendemail' , (req,res)=>{
    upload(req,res, (error)=>{
        if (error) {
            console.log("erreur pour charger le fichier ")
            return;
        }
        else{

            req.files.forEach(file =>{
                paths.push({
                    filename:Date.now() + "file " + path.extname(file.originalname),
                    path:file.path
                })

            });
            let user_email = req.body.email
            let user_objet = req.body.objet
            let user_message = req.body.message
            sendEmail(paths,user_email,user_objet,user_message)
            .then((result)=>{
                res.send("Email envoyer voir votre boite mail ")
            })
            .catch((error)=>{
                res.send("Email non envoyer ")
            })
        }
    })
    
})


app.listen(PORT, () => {
    console.log("application démarre en port 3000  ")
})




async function sendEmail(paths,user_email,user_objet,user_message) {
    try {
        const transport = nodemailer.createTransport({
            service : 'gmail',
            auth : {
                type: 'OAuth2',
                user: 'useremail',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                accessToken :'',


            },

        });
        const mailOptions = {
            from: user_email,
            to: '',
            subject: user_objet ,
            text:user_message,
            attachments: paths
        }
        const result = await transport.sendMail(mailOptions);

        return result;
        



    } catch (error){
        return error;
    }

}
 
