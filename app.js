const express = require('express');
const crafts = require('./record');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'static/crafts')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({
    storage: storage
})


// Serve static files from the "static" directory
app.use(express.static('static'));

// Define the route for the root URL of the website
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Define the route for the /api/crafts URL
app.get('/api/crafts', (req, res) => {
    res.send(crafts);
});

// save the record
app.post('/api/crafts', upload.single('file'), (req, res) => {
    // file to static/crafts 
    const filePath = path.join('static/crafts', req.file.originalname);
    fs.rename(req.file.path, filePath, function(err) {
        if (err) {
            console.log(err);
            res.status(500).send('File upload failed');
            return;
        }
        
        req.body.supplies = JSON.parse(req.body.supplies);
        req.body.image = req.file.originalname;

        console.log(req.body);

        // req.body contains the text fields
        crafts.push(req.body);
        res.send('Record and file added to the database');
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});