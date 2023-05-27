//keeping filter string same way move callback functions to controllers 
//keeps routes page clean 
//modules.export allows one export
//exports.<name of function pointer> = pointer to the function.
const { update } = require('lodash');
const HttpError = require('../models/http-errors');
const { patch } = require('../routes/places-routes');
const { validationResult } = require('express-validator');
const Place = require('../models/places');

let DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Qutub Minar monument.',
        description: "One of the tallest monument in India.",
        location: {
            city: "Delhi",
            metro_station: "Qutub Minar",
        },
        address: "Seth Sarai, Mehrauli, New Delhi, Delhi 110016",
        creator: 'u1'
    },
    {
        id: 'p2',
        title: 'Statue of Unity',
        description: "Tallest in the world. ",
        location: {
            city: "Sardar sarovar Dam",
            metro_station: "SOLITONS",
        },
        address: "Statue of Unity Rd, Kevadia, Gujarat 393155",
        creator: 'u1'
    }
]


const getPlacesbyID = (req, res, next) => {
    const placeId = req.params.pid;
    const place = DUMMY_PLACES.find(p => {
        return p.id === placeId;
    });
    if (!place) {
        throw new HttpError('Could not find a place for the provided ID.', 404);
    }
    res.json({ place });
};

const getPlacesByUserID = (req, res, next) => {
    const userID = req.params.userId;
    const userPlaces = DUMMY_PLACES.filter(u => {
        return u.creator === userID;
    });
    if (!userPlaces || userPlaces.length === 0) {
        return next(new HttpError('Could not places for the provided user ID.', 404));
    }
    res.send({ userPlaces });
};
const createPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        //means we do have errors. now handle it.
        console.log(errors);
        throw new HttpError('Invalid inputs passed, please check your data.', 422);
    }

    const { id, title, description, address, location, creator } = req.body;
    const createdPlace = new Place({
        title,
        description,
        address,
        location,
        image: 'https://www.shorturl.at/img/shorturl-icon.png',
        creator
    });
    //save is a promise thus asynchronous 
    try {
        await createdPlace.save();
    } catch (err) {
        const error = new HttpError(
            'Creating place failed, please try again.',
            500
        );
        return next(error);
    }

    res.status(201).json({ place: createdPlace });
};
const deletePlace = (req, res, next) => {
    const deleteID = req.params.dID;
    if (!DUMMY_PLACES.find(delID => delID === deleteID)) {
        throw new HttpError("Could not find a place for that id.", 404);
    }
    DUMMY_PLACES = DUMMY_PLACES.filter((del => del.id != deleteID));
    console.log(DUMMY_PLACES);

    res.status(201).json({ message: 'Deleted Place. ' });
}
const updatePlaces = (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        //means we do have errors. now handle it.
        console.log(errors);
        throw new HttpError('Invalid inputs passed, please check your data.', 422);
    }

    const placeID = req.params.pID;
    const { title, description } = req.body;
    const updatedPlace = { ...DUMMY_PLACES.find(p => p.id === placeID) };
    const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeID);
    updatedPlace.title = title;
    updatedPlace.description = description;
    DUMMY_PLACES[placeIndex] = updatedPlace;
    res.status(200).json({ place: DUMMY_PLACES[placeIndex] });
}
exports.routeByPlaces = getPlacesbyID;
exports.routeByUsers = getPlacesByUserID;
exports.createPlace = createPlace;
exports.deletePlaceByID = deletePlace;
exports.updatePlaces = updatePlaces;