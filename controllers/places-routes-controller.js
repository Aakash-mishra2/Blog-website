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


const getPlacesbyID = async (req, res, next) => {
    const placeId = req.params.pid;
    //findById is a static method means not used on instance of place but directly on place constructor
    //function. contrast to save does not return a promise. call exec() after findById() to get a promise.  
    //have to define place out of try block scope. 
    let place;
    try {
        place = await Place.findById(placeId);

    } catch (err) {
        //this error should be thrown in case database has no file.
        const error = new HttpError(
            'Something went wrong, could not find a place.', 500
        );
        return next(error);
    }
    //this error should be thrown in case of wrong ID in request body.
    if (!place) {
        const error = new HttpError('Could not find a place for the provided ID.', 404);
        return next(error);
    }
    //a database mongoose object to normal javascript object.
    //when we get back the response, the object will be easy to use if we just turn it into 
    //the normal javascript object.
    //returned object will have two id attributes with and without underscore.
    res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserID = async (req, res, next) => {
    const userID = req.params.userId;
    let userPlaces;
    try {
        //find returns an array here thus can't use toObject.
        userPlaces = await Place.find({ creator: userID });
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find a place.', 500
        );
        return next(error);
    }
    if (!userPlaces || userPlaces.length === 0) {
        const error = new HttpError('Could not places for the provided user ID.', 404)
        return next(error);
    }
    res.json({ userPlaces: userPlaces.map(place => place.toObject({ getters: true })) });
};

//throw error cannot be used we are inside a asynchronous task.
const createPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        //means we do have errors. now handle it.
        const error = new HttpError('Invalid inputs passed, please check your data.', 422);
        return next(error);
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
const deletePlace = async (req, res, next) => {
    const deleteID = req.params.dID;
    let deletePlace;
    try {
        deletePlace = await Place.findById(deleteID);
    } catch (err) {
        const error = new HttpError(' Could not find your place. Please retry. ');
        return next(error);
    }
    try {
        await deletePlace.remove();
    } catch (err) {
        const error = new HttpError(' Something went wrong, could not delete place. ', 500);
        return next(error);
    }
    res.status(201).json({ message: 'Deleted Place. ' });
}
const updatePlaces = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        //means we do have errors. now handle it.
        console.log(errors);
        throw new HttpError('Invalid inputs passed, please check your data.', 422);
    }

    const { title, description, image } = req.body;
    const placeID = req.params.pID;

    let place;
    try {
        place = await Place.findById(placeID);
    } catch (err) {
        const error = new HttpError('Something went wrong, could not find place. ', 500);
        return next(error);
    }

    place.title = title;
    place.description = description;
    place.image = image;

    try {
        await place.save();
    } catch (err) {
        const error = new HttpError('Something went wrong, could not update place. ', 500);
        return next(error);
    }
    res.status(200).json({ place: place.toObject({ getters: true }) });
}
exports.routeByPlaces = getPlacesbyID;
exports.routeByUsers = getPlacesByUserID;
exports.createPlace = createPlace;
exports.deletePlaceByID = deletePlace;
exports.updatePlaces = updatePlaces;