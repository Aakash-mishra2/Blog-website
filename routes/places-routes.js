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
        value: "Here i am"
    }
]
router.get('/:pid', (req, res, next) => {
    const placeId = req.params.pid;
    const place = DUMMY_PLACES.find(p => {
        return p.id = placeId;
    });
    res.json({ place });
});
//connection between our app.js file and the routes we are configuring here
//we need to export our router.
module.exports = router;
