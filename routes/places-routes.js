const express = require('express');
const router = express.Router();
const placesControllers = require('../controllers/places-routes-controller');

//focussed file all about routing and mapping paths with controllers separated for the logic.

router.get('/:pid', placesControllers.routeByPlaces);
router.get('/user/:userId', placesControllers.routeByUsers);

module.exports = router;
