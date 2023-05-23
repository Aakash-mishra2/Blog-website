const express = require('express');
const router = express.Router();
const placesControllers = require('../controllers/places-routes-controller');

router.get('/:pid', placesControllers.routeByPlaces);
router.get('/user/:userId', placesControllers.routeByUsers);
router.post('/', placesControllers.createPlace);
router.get('/delete/:Did', placesControllers.deletePlaceByID);
router.post('/patch/:pID', placesControllers.updatePlaces);
module.exports = router;
