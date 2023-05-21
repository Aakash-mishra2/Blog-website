//keeping filter string same way move callback functions to controllers 
//keeps routes page clean 
//modules.export allows one export
//exports.<name of function pointer> = pointer to the function.
const HttpError = require('../models/http-errors');
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
        return next(HttpError('Could not find a place for the provided user ID.', 404));
    }
    res.send({ userPlace });
};

exports.routeByPlaces = getPlacesbyID;
exports.routeByUsers = getUserbyID;
