const express = require("express"),
      CRC16 = require('./CRC16.js'),
      bodyParser = require('body-parser');

let app = express();


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));


app.get("/", function(req, res){
    // console.log("Haciendo un get");
    res.redirect("/calculate");
});

app.get("/calculate", function(req, res){
    // console.log("Haciendo un get");
    res.render("index", {type: 'calculate', result: false});
});

app.get("/check", function(req, res){
    // console.log("Haciendo un get");
    res.render("index", {type: 'check',result: false, messageTooLong: false});
});

app.get("*", function(req, res){
    return res.redirect('/');
});



app.post("/calculate", function(req, res){
    // console.log(req.body);
    message = new CRC16(req.body.message);
    information = message.getRemainder(true);

    if(req.body.message.length < 1021){
        if(req.body.message.length > 50){
            return res.render("index", {type: 'calculate',result: true, information: information, len: message.binaryMessageArray.length, CRCsize: 16, mensajeEnviar: req.body.message, showProcess: false});
        }else{
            return res.render("index", {type: 'calculate',result: true, information: information, len: message.binaryMessageArray.length, CRCsize: 16, mensajeEnviar: req.body.message, showProcess: true});
        }
    }

    return res.render("index", {type: 'calculate', result: false, messageTooLong: true});
    // console.log(information);
    // console.log(req.params.type);
    // console.log("Haciendo un post");
    
});

app.post("/check", function(req, res){
    // console.log(req.body.remainder);
    // console.log(req.body.textTransformed);
    // console.log(req.body.message);
    message = new CRC16(req.body.textTransformed);
    message.binaryMessage = req.body.message;
    information = message.getRemainder(false);
    // console.log(information);
    let validity = true;
    for(let i=0 ; i<information.remainder.length; i++){
        if(information.remainder[i] == 1){
            validity = false;
        }
    }
    res.render("index", {type: 'check', result: true, validity: validity, binaryMessage:req.body.message ,remainder: req.body.remainder , stringMessage: req.body.textTransformed});
});

app.listen(process.env.PORT || 3000, process.env.IP, function(req, res){
    console.log("El servidor ha comenzado en el puerto 3000");
});