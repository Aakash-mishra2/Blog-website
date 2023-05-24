const HttpError = require("../models/http-errors");

let DUMMY_USERS = [
    {
        id: "34",
        name: "Aakash "
    },
    {
        id: "456",
        name: "Harshit"
    },
    {
        id: "32",
        name: "Prakash"
    }
];
const getUser = (req, res, next) => {
    const usID = req.params.userID;

    const users = DUMMY_USERS.find(u => {
        return u.id === usID;
    });
    if (!users) {
        throw new HttpError('Could not find a user for the provided ID.' + usID, 404);
    }
    res.send({ users });
}
const createUser = (req, res, next) => {
    const { id, name } = req.body;
    const newUser = {
        id,
        name
    }
    if (!newUser) {
        const error = new HttpError(" could not create new account. So", 404);
        throw error;
    }
    DUMMY_USERS.push(newUser);
    console.log(DUMMY_USERS);
    res.status(200).json({ message: "created Account and logged in. " });
}
const loginUser = (req, res, next) => {
    const userID = req.body;
    const account = DUMMY_USERS.find((acc => acc.id === userID.id));

    if (!account) {
        const error = new HttpError("No account exists with this ID. Signup to create new Account.", 404);
        throw error;
    }
    res.status(200).json({ welcome: account.name });
}
exports.getUserByID = getUser;
exports.createUser = createUser;
exports.logUser = loginUser;