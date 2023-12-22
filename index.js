const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const router = express.Router();
const blogRoutes = require('./src/routes/blog');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

// app.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader("Access-Control-Allow-Headers", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
//     res.setHeader("Content-Type", "Authorization");
//     next();
// })

// handling upload img
const fileStorage = multer.diskStorage({
    destinantion: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + '-' + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    if(
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true)
    } else {
        cb(null, false)
    }
};

app.use(cors());
app.use(bodyParser.json());
app.use('/image', express.static(path.join(__dirname, 'images'))); // middleware utk akses image folder
app.use(multer({ storage: fileStorage, fileFilter: fileFilter}).single('image'));

// router
app.use("/v1/api/blog", blogRoutes);

// handle error
app.use((error, req, res, next) => {
    const status = error.errorStatus || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({
        message: message,
        data: data
    });
})

// serve

const PORT = 3030
mongoose.connect('mongodb+srv://alno:AHkq2YToeHNunKGv@cluster0.o2vnc6a.mongodb.net/?retryWrites=true&w=majority')
.then(() => {
    app.listen(PORT, () => console.log('Koneksi berhasil'));
})
.catch(err => console.log('Error : => ', err))