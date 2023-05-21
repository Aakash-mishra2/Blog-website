const express = require('express');
const HttpError = require('../models/http-errors');
const router = express.Router();

router.get('/route1', (req, res, next) => {
    console.log('Get Request is Places');
    res.json({ message: "It Works!" });
});
const DUMMY_PLACES = [
    {
        id: 'u1',
        user: 'sky',
        value: "Here i am",
        title: 'Empoire State building',
        description: "One of the most famous sky. "
    }
]
router.get('/:pid', (req, res, next) => {
    const placeId = req.params.pid;
    const place = DUMMY_PLACES.find(p => {
        return p.id === placeId;
    });
    if (!place) {
        throw new HttpError('Could not find a place for the provided ID.', 404);
    }
    res.json({ place });
});
router.get('/user/:userId', (req, res, next) => {
    const userID = req.params.userId;
    const userPlace = DUMMY_PLACES.find(u => {
        return u.user === userID;
    });
    if (!userPlace) {
        return next(HttpError('Could not find a place for the provided user ID.', 404));
    }

    res.send({ userPlace });

});

module.exports = router;
