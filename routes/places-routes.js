const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const placesControllers = require('../controllers/places-routes-controller');

router.get('/:pid', placesControllers.routeByPlaces);
router.get('/user/:userId', placesControllers.routeByUsers);
router.post(
    '/',
    [
        check('title')
            .not()
            .isEmpty(),
        check('description')
            .isLength({ min: 5 }),
        check('address')
            .not()
            .isEmpty()
    ],
    placesControllers.createPlace
);

router.delete('/:dID', placesControllers.deletePlaceByID);
router.patch('/:pID',
    [
        check('title').not().isEmpty(),
        check('description').isLength({ min: 5 }),
    ]
    , placesControllers.updatePlaces);
module.exports = router;
