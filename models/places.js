const mongoose = require('mongoose');

const Schema = mongoose.Schema;
//image always is a URL in database to make managing easy.

const placeSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    address: { type: String, required: true },
    location: {
        city: { type: Number, required: true },
        metro_station: { type: Number, required: true }
    },
    //we have to tell creator is mongoose type object not javascript
    //ref : reference to conection with other schema.
    creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' }
});
module.exports = mongoose.model('Place', placeSchema);