const path = require('path')

const express = require('express')
const mongoose = require('mongoose')
const multer = require('multer')

const feedRoutes = require('./routes/feed')
const authRoutes = require('./routes/auth')

const app = express()

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        date = Date.now()
        cb(null, date + '-' + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' ||file.mimetype === 'image/jpg' ) {
        cb(null, true)
    }else{
        cb(null, false)
    }
}

app.use(express.json())
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(multer({storage: fileStorage, fileFilter:fileFilter}).single('image'))


app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
})

app.use('/feed', feedRoutes)
app.use(authRoutes)


app.use((error, req, res, next) => {
    console.log(error)
    const statusCode = error.statusCode
    const message = error.message
    const data = error.data
    return res.status(statusCode).json({
        message: message,
        data: data
    })

})

mongoose.connect('mongodb+srv://Orero:orero2002@cluster0.zf1ulpl.mongodb.net/blog?retryWrites=true&w=majority')
.then(result => {
    const server = app.listen(8080)  
    const io = require('./socket').init(server)
    io.on('connection', socket => {
        console.log('Client Connected')
    })
}).catch(error => {
    console.log(error)
})
