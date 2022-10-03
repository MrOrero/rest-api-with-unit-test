const express = require('express')
const {check, body} = require('express-validator')

const User = require('../models/user')
const authController = require('../controllers/auth')

const router = express.Router()

router.put('/signup',[
    body('email').isEmail().withMessage('Please enter a valid email')
    .custom(async (value, {req}) => {
        const email = await User.findOne({email:value})
        if (email) {
            throw new Error('Email already exists')
        }
    }).normalizeEmail(),
    body('name').isString().ltrim().rtrim().isLength({min:5, max:20}),
], authController.signup)

router.post('/login', authController.postLogin)

module.exports = router