var express = require("express");
var app = express();
var multer = require('multer');
var upload = multer({ dest: 'upload/' }); 

//Setting up the listener port
app.listen(3000,()=>
{
  console.log("Listening on port 3000!");
});


//The main controller for loading index.html
app.get("/",(request, response)=>
{
  response.sendFile(__dirname+"/views/index.html");
});

/*
//The file needs to be sent through this controller
app.get("/upload",(request, response)=>
{
  var fileData = 
  {
    "name": "",
    "size": 0,
    "date": "",
    "file": ""
  };  
});*/

app.post('/upload', upload.any(), function(request, response, next) 
{
  console.log(request.body, 'Body');
  console.log(request.files, 'files');
  response.end();
});