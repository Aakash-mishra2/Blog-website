const HttpError = require("../models/http-errors");
const { validationResult } = require("express-validator");
const User = require('../models/users');

const getUser = async (req, res, next) => {
    let allUsers;
    try {
        allUsers = await User.find();
    } catch (err) {
        const error = new HttpError(' Could not get all users. ', 400);
        return next(error);
    }
    if (!allUsers) {
        return next(new HttpError('Could not find any users. ', 400));
    }
    res.status(200).json({ users: allUsers.map(user => user.toObject({ getters: true })) });
}
const getUserbyID = async (req, res, next) => {
    const usID = req.params.userID;
    let users;
    try {
        users = await User.findById(usID);
    } catch (err) {
        const error = new HttpError(' Could not get users. ', 400);
        return next(error);
    }
    if (!users) {
        return next(new HttpError('Could not find a user for the provided ID.' + usID, 404));
    }
    res.status(200).json({ users: users.toObject({ getters: true }) });
}
const createUser = async (req, res, next) => {
    //checked if the user exists.
    const { name, email, password } = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError(
            'Signing up failed please try again later. ', 500
        );
        return next(error);
    }

    if (existingUser) {
        const error = new HttpError('Signup failed, user exists already, please login instead.', 401);
        return next(error);
    }
    //password must be encrypted at some later stage.
    //places will automatically be added so also remove places from above req body fetch command.
    const createdUser = new User({
        name,
        email,
        image: 'https://---.com',
        password,
        places: []
    });

    try {
        await createdUser.save();
    } catch (err) {
        const error = new HttpError(
            'Signing up failed, please try again.',
            500
        );
        return next(error);
    }
    res.status(200).json({ user: createdUser.toObject({ getters: true }) });
}
const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError(
            'Login up failed please try again later. ', 500
        );
        return next(error);
    }
    //if existing user not stored in database or if existing user password is not equal to entered 
    //password.
    if (!existingUser || existingUser.password !== password) {
        const error = new HttpError(
            'Invalid credentials, could not log you in.', 401
        );
        return next(error);
    }
    res.json({
        message: 'Logged in!.',
        user: existingUser.toObject({ getters: true })
    });
}
exports.allUser = getUser;
exports.getUserByID = getUserbyID;
exports.createUser = createUser;
exports.logUser = loginUser;