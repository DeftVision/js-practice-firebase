const mongoose = require("mongoose");
const schema = mongoose.Schema;

const fbSchema = new schema({
    name: {
        type: String,
        required: true,
    },
    fileUpload: {
        type: String,
        required: true,
    }
},
    {timestamps: true});

const fbModel = mongoose.model('Fb', fbSchema);
module.exports = fbModel;