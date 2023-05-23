const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-routes-controller');
router.get('/:userID', userController.getUserByID);
router.post('/signup', userController.createUser);
router.post('/login', userController.logUser);
module.exports = router;