var express = require('express');
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });
var path = require('path');
var fs = require('fs');
var app = express();
var MongoClient = require("mongodb").MongoClient;
var storage = multer.diskStorage(
{
        destination: function(req, file, callback) 
        {
          callback(null, 'uploads/')
        },
        filename: function(req, file, callback) 
        {
          callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
        }
});

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

//API to upload the file to the server
app.post('/upload', upload.single("file"), async (req, res) => 
{
    var dbObject = 
    {
        name: "",
        size: 0,
        date: "",
        file: ""
    };
    try 
    {
        var upload = multer
        ({
          storage: storage
        }).single('file')
        upload(req, res, function(err) 
        {
          dbObject.name = req.file.originalname;
          dbObject.size = req.file.size;
          dbObject.date = new Date().toLocaleString();
          dbObject.file = req.file.filename;
          
          MongoClient.connect(process.env.MONGODB_URL,function(error, database)
            {
              if(error) throw error;
              else
              {
                var databaseObject = database.db("fcc_node_challenge_one");
                databaseObject.collection("file_metadata").insertOne(dbObject, function(err, result)
                {
                  if(err) throw(err);
                  else
                  {
                    database.close();
                    console.log(dbObject);
                  }
                });
              }
            });
          res.json({size:req.file.size})
        })
    } 
    catch (err) 
    {
        res.sendStatus(400);
    }
});

//API to delete all the files in the server
app.get('/delete',(req, res) => 
{
  const directory = 'uploads';
  fs.readdir(directory, (err, files) => 
  {
    if (err) throw err;
    for (const file of files) 
    {
      fs.unlink(path.join(directory, file), err => 
      {
        if (err) res.json("Error, Couldn't delete!!"+file);
      });
    }
  });
  res.json("All files deleted!");
});
