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
//for post request information is in the body and data send is inside post body.
//extracting data from the request body json object.
const createPlace = (req, res, next) => {
    //donot use bodyParser any where else other than app.js and change the same to json there only.
    //do not put body Parser in places-routes.js.
    const { title, description, user, value } = req.body;
    console.log(title);
    console.log(description);
    //now create a place from this request
    const createdPlace = {
        title,
        description,
        user,
        value
    };

    DUMMY_PLACES.push(createdPlace); //this object created from extracting info from request 
    //can be added to DUMMY_places.
    //unshift(createdPlace)
    res.status(201).json({ place: createdPlace });
}
exports.routeByPlaces = getPlacesbyID;
exports.routeByUsers = getUserbyID;
exports.createPlace = createPlace;