const { Schema, model } = require('mongoose');


const SpamSchema = Schema({

    expresiones: [{
        type: String,
        required: true
    }]

});

SpamSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();
    return object;
})


module.exports = model('Spam', SpamSchema);