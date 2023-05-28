const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    //unique creates index for the email which speeds up the querying proces by request.
    //creates internal index in a database makes it easier to querying our database.
    //but we need internal validation if the required email address exists already. - third party
    //package unique-validator
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 6 },
    image: { type: String, required: true },
    //ids of places allocated to the user 
    places: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', userSchema);