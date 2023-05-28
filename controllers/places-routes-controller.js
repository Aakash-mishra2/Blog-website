const HttpError = require('../models/http-errors');
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const { patch } = require('../routes/places-routes');
const { validationResult } = require('express-validator');
const Place = require('../models/places');
const User = require('../models/users');

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
    //fields of db document.
    const { id, title, description, address, location, creator } = req.body;
    const createdPlace = new Place({
        title,
        description,
        address,
        location,
        image: 'https://www.shorturl.at/img/shorturl-icon.png',
        creator
    });
    console.log(createdPlace);
    let user;
    try {
        user = await User.findById(creator);
    } catch (err) {
        const error = new HttpError(
            'Creating place failed, please try again.',
            500
        );
        return next(error);
    }

    if (!user) {
        const error = new HttpError("Could not find user for provided ID. ", 404);
        return next(error);
    }
    console.log(user);
    //creating a place + //storing the id of our places in user document 
    //if one of these operations fails, we need to undo all operation of changing documents .
    //for that we use transactions: perform multiple operations independent of each other.
    //tsxn are built on sessions: first start session then initiate txn and terminate opp order.

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        //now tell mongoose what we want to do here.
        await createdPlace.save({ session: sess });
        //will auto create unique id for our place.

        //now part 2 store place make sure placeID is added to user.
        user.places.push(createdPlace);
        await user.save({ session: sess });

        //at this point changes are saved in database for real and if any task wrong all steps 
        //rollback.
        await sess.commitTransaction();
        //for places if we donot have places collection it will not be automatically created.

    } catch (err) {
        //either database server is down or database validation fails.
        const error = new HttpError(
            'Creating place failed session , please try again.',
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