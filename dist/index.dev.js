"use strict";

var express = require("express");

var multer = require("multer");

var ejs = require("ejs");

var path = require("path"); // Set storage engine


var storage = multer.diskStorage({
  destination: './public/uploads',
  filename: function filename(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
}); // Init upload

var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000
  },
  fileFilter: function fileFilter(req, file, cb) {
    checkFileType(file, cb);
  }
}).single('myImage'); // Check file type

function checkFileType(file, cb) {
  // Allowed extensions
  var filetypes = /jpeg|jpg|png|gif/; // Check extension

  var extname = filetypes.test(path.extname(file.originalname).toLowerCase()); // Check mime

  var mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images only');
  }
} // Init app


var app = express(); // EJS

app.set('view engine', 'ejs'); // Public folder

app.use(express["static"]('./public'));
app.get('/', function (req, res) {
  return res.render('app');
});
app.post('/upload', function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      res.render('app', {
        msg: err
      });
    } else {
      if (req.file == undefined) {
        res.render('app', {
          msg: 'Error: No file selected!'
        });
      } else {
        res.render('app', {
          msg: 'File uploaded!',
          file: "uploads/".concat(req.file.filename)
        });
      }
    }
  });
});
var port = 3000;
app.listen(port, function () {
  return console.log("Server started on port ".concat(port));
});