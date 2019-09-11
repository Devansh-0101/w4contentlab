const mongoose = require('mongoose');

let taskSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    
    name: String,

    assignTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Developer'
    },

    dueDate: {
        type: Date,
        //default: Date.now
    },
    
    status:{
        type: String,
        validate: {
            validator: function (taskStatusValue){
                return taskStatusValue === "InProgress" || taskStatusValue === "Complete";
            },
            message: 'The task status should either be "InProgress" or "Complete"'
        }
    },

    description: String

});


module.exports = mongoose.model('Task', taskSchema);