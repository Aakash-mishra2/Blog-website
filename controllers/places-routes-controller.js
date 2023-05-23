//keeping filter string same way move callback functions to controllers 
//keeps routes page clean 
//modules.export allows one export
//exports.<name of function pointer> = pointer to the function.
const { update } = require('lodash');
const HttpError = require('../models/http-errors');
const { patch } = require('../routes/places-routes');
const DUMMY_PLACES = [
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
    const deleteID = req.params.Did;
    const deletedPlace = DUMMY_PLACES.find(del => {
        return del.id === deleteID;
    });

    if (!deletedPlace) {
        const error = new HttpError("No place is present with ID = " + deleteID, 404);
        throw error;
    }
    DUMMY_PLACES.filter(del => {
        return del.id !== deleteID;
    });
    console.log(DUMMY_PLACES);

    res.status(201).json({ place: deletedPlace });
}
const patchPlaces = (req, res, next) => {
    const placeID = req.params.pID;
    const { title, description, user, value } = req.body;
    const patchPlace = {
        id: placeID,
        title,
        description,
        user,
        value
    };
    const updateIndex = DUMMY_PLACES.findIndex((obj => obj.id === pID));

    DUMMY_PLACES[updateIndex] = patchPlace;
    res.status(201).json({ place: DUMMY_PLACES[updateIndex] });
}
exports.routeByPlaces = getPlacesbyID;
exports.routeByUsers = getUserbyID;
exports.createPlace = createPlace;
exports.deletePlaceByID = deletePlace;
exports.updatePlaces = patchPlaces;