const express = require('express')
const {check, body} = require('express-validator')

const router = express.Router()

const feedController = require('../controllers/feed')
const isAuth = require('../middleware/is-auth')

router.get('/posts', isAuth, feedController.getPosts)

router.get('/post/:postId', isAuth, feedController.getPost)

router.post('/post', isAuth, [
    body('title','The title should have words you fool (Not more than 20 tho)').isString().ltrim().rtrim().isLength({min:5, max:20}),
    body('content', 'Content is too short').ltrim().rtrim().isLength({min:5, max:400})
], feedController.postcreatePost)

router.put('/post/:postId', isAuth, [
    body('title','The title should have words you fool (Not more than 20 tho)').isString().ltrim().rtrim().isLength({min:5, max:20}),
    body('content', 'Content is too short').ltrim().rtrim().isLength({min:5, max:400})
], feedController.putUpdatePost)

router.delete('/post/:postId', isAuth, feedController.deletePost )

module.exports = router