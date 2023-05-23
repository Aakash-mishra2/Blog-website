//keeping filter string same way move callback functions to controllers 
//keeps routes page clean 
//modules.export allows one export
//exports.<name of function pointer> = pointer to the function.
const { update } = require('lodash');
const HttpError = require('../models/http-errors');
const { patch } = require('../routes/places-routes');
let DUMMY_PLACES = [
    {
        id: 'u1',
        user: 'sky',
        value: "Here i am",
        title: 'Empoire State building',
        description: "One of the most famous sky. "
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

const getUserbyID = (req, res, next) => {
    const userID = req.params.userId;
    const userPlace = DUMMY_PLACES.find(u => {
        return u.user === userID;
    });
    if (!userPlace) {
        return next(new HttpError('Could not find a place for the provided user ID.', 404));
    }
    res.send({ userPlace });
};
const createPlace = (req, res, next) => {
    const { id, title, description, user, value } = req.body;
    const createdPlace = {
        id,
        title,
        description,
        user,
        value
    };

    DUMMY_PLACES.push(createdPlace);
    console.log(DUMMY_PLACES);
    res.status(201).json({ place: createdPlace });
};
const deletePlace = (req, res, next) => {
    const deleteID = req.params.dID;
    //filter runs on every item on the array and if we return true in the function we keep that 
    //item in newly returned array. If we return false we drop it from newly returned array. 
    DUMMY_PLACES = DUMMY_PLACES.filter((del => del.id != deleteID));
    console.log(DUMMY_PLACES);

    res.status(201).json({ message: 'Deleted Place. ' });
}
const updatePlaces = (req, res, next) => {
    const placeID = req.params.pID;
    const { title, description } = req.body;
    const updatedPlace = { ...DUMMY_PLACES.find(p => p.id === placeID) };
    const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeID);
    updatedPlace.title = title;
    updatedPlace.description = description;
    //objects are by reference in javascript. So not change directly.
    //make a copy update it then change object.
    DUMMY_PLACES[placeIndex] = updatedPlace;
    res.status(200).json({ place: updatedPlace });
}
exports.routeByPlaces = getPlacesbyID;
exports.routeByUsers = getUserbyID;
exports.createPlace = createPlace;
exports.deletePlaceByID = deletePlace;
exports.updatePlaces = updatePlaces;