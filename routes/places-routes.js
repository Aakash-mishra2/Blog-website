const express = require('express');
const router = express.Router();
//validator imported with object destructuring , not the ususal way
const { check } = require('express-validator');
//check is a method which can be executed as a new middleware configured to our validation requirements


const placesControllers = require('../controllers/places-routes-controller');

router.get('/:pid', placesControllers.routeByPlaces);
router.get('/user/:userId', placesControllers.routeByUsers);
//you can register multiple middlewares on the same http method-path combination.
//they will be executed left to right in your arguments.
router.post(
    '/',
    [
        //registering validation middleware alone will not return errors.
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

//now validator middleware needs to be configured.//till now I wanna check title but now how to 
//check , for that we can chain multiple methods on check method.
//for example .not().isEmpty() = title is not empty = method.

router.delete('/:dID', placesControllers.deletePlaceByID);
router.patch('/:pID', placesControllers.updatePlaces);
module.exports = router;
