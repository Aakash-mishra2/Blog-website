const HttpError = require('../models/http-errors');
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

const { validationResult } = require('express-validator');
const Place = require('../models/places');
const User = require('../models/users');

const getPlacesbyID = async (req, res, next) => {
    const placeId = req.params.pid;
    let place;
    try {
        place = await Place.findById(placeId);

    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find a place.', 500);
        return next(error);
    }
    if (!place) {
        const error = new HttpError('Could not find a place for the provided ID.', 404);
        return next(error);
    }
    res.json({ place: place.toObject({ getters: true }) });
};
const getPlacesByUserID = async (req, res, next) => {
    const userID = req.params.userId;
    let userWithPlaces;
    try {
        userWithPlaces = await User.findById(userID).populate('places');
    } catch (err) {
        const error = new HttpError('Something went wrong, could not find a place.', 500);
        return next(error);
    }
    if (!userWithPlaces || userWithPlaces.length === 0) {
        const error = new HttpError('Could not places for the provided user ID.', 404)
        return next(error);
    }
    res.json({ userPlaces: userWithPlaces.places.map(place => place.toObject({ getters: true })) });
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
    let sess;
    try {
        sess = await mongoose.startSession();
        sess.startTransaction();
        await createdPlace.save({ session: sess });
        user.places.push(createdPlace);
        await user.save({ session: sess });
        await sess.commitTransaction();
        sess.endSession();
    } catch (err) {
        const error = new HttpError(" Creating place session failed , please try again.", 500);
        return next(error);
    }

    res.status(200).json({ place: createdPlace });
};
const deletePlace = async (req, res, next) => {
    const deleteID = req.params.dID;
    let deletePlace;
    try {
        deletePlace = await Place.findById(deleteID).populate('creator');
        //populate : to refer to a document stored in different collection and to refer to 
        //a document stored in that different collection.
        //relations set up between two collections then only popualate can be used.
    } catch (err) {
        const error = new HttpError(' Could not find your place. Please retry. ');
        return next(error);
    }
    if (!deletePlace) {
        const error = new HttpError('could not find place for this ID', 404);
        return next(error);
    }

    try {
        const sess2 = await mongoose.startSession();
        sess2.startTransaction();
        await deletePlace.remove({ session: sess2 });
        deletePlace.creator.places.pull(deletePlace);
        await deletePlace.creator.save({ session: sess2 });
        await sess2.commitTransaction();
        sess2.endSession();
    } catch (err) {
        const error = new HttpError(' Something went wrong, could not delete place. ', 500);
        return next(error);
    }
    res.status(201).json({ message: 'Deleted Place.' });
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
    //modify requested object now.
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