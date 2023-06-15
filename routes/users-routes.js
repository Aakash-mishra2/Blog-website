const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const userController = require('../controllers/user-routes-controller');
router.get('/', userController.allUser);
router.get('/single/:userID', userController.getUserByID);
router.post('/signup',
    [
        check('name').not().isEmpty(),
        check('email').normalizeEmail() //Test@test.com => test@test.com
            .isEmail(),
        check('password').isLength({ min: 6 })
    ]
    , userController.createUser);
router.post('/login', userController.logUser);
module.exports = router;