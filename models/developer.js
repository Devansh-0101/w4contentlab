const mongoose = require('mongoose');

let developerSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    
    name: {
        firstName:{type: String, required: true},
        lastName:String,
       },

    level: {
        type: String,
        required: true,
        set: function (levelValue){
            return levelValue.toUpperCase();
        },
        validate: {
            validator: function (levelValue){
                return levelValue === "EXPERT" || levelValue === "BEGINNER";
            },
            message: 'The developers level should either be "Beginner" or "Expert"'
        }
    },
    address: {
        state:String,
        suburb:String,
        street:String,
        unit:String
       }
});


module.exports = mongoose.model('Developer', developerSchema);


// Each developer has the following fields (Developers Schema):
// name: an object has
// first name  (required)
// last name
// Level: String and can be either ‘Beginner or Expert’. (required and should be saved in all caps)
// Address: Object has
// State
// Suburb
// Street
// Unit