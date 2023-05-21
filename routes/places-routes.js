const express = require('express');

const router = express.Router();
//filter string: path by which we want to filter
//and a callback function.
//json = {"properties": "string values"}
router.get('/route1', (req, res, next) => {
    //json() method takes any data that is convertible to json format, object, arrays numbers
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
        return p.id = placeId;
    });
    if (!place) {
        //adding message via json on error status.
        //return to stop further code execution and not send blank object.
        return res.status(404).json({ message: 'Could not find a place for the provided ID. ' })//default 200.
    }
    res.json({ place }); //auto submit.
});
router.get('/user/:userId', (req, res, next) => {
    const user = req.params.userId;
    const userPlace = DUMMY_PLACES.find(u => {
        return u.user = user;
    });
    if (!userPlace) {
        //adding message via json on error status.
        //return to stop further code execution and not send blank object.
        return res
            .status(404)
            .json({ message: 'Could not find a place for the provided USER ID. ' })//default 200.
    }
    const sendingUser = { id: userPlace.id, userName: userPlace.user, title: userPlace.title };
    res.send({ sendingUser });
});
//connection between our app.js file and the routes we are configuring here
//we need to export our router.
module.exports = router;
