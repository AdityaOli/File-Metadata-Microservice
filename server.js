var express = require("express");
var app = express();

//Setting up the listener port
app.listen(3000,()=>
{
  console.log("Listening on port 3000!");
});