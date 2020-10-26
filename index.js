const express = require("express");
const multer = require("multer");
const ejs = require("ejs");
const path = require("path");

// Set storage engine
const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('myImage');

// Check file type
function checkFileType(file, cb) {
    // Allowed extensions
    const filetypes = /jpeg|jpg|png|gif/;
    // Check extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images only');
    }
}

// Init app
const app = express();

// EJS
app.set('view engine', 'ejs');

// Public folder
app.use(express.static('./public'));

app.get('/', (req, res) => res.render('app'));

app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
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
                    file: `uploads/${req.file.filename}`
                });
            }
        }
    })
})

const port = 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));