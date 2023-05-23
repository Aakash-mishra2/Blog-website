const express = require('express');
const router = express.Router();
const placesControllers = require('../controllers/places-routes-controller');

router.get('/:pid', placesControllers.routeByPlaces);
router.get('/user/:userId', placesControllers.routeByUsers);
router.post('/', placesControllers.createPlace);
router.delete('/:dID', placesControllers.deletePlaceByID);
router.patch('/:pID', placesControllers.updatePlaces);
module.exports = router;
