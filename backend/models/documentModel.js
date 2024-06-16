const mongoose = require("mongoose");

const schema = mongoose.Schema;

const documentSchema = new schema({
    docName: {
        type: String,
        require: true,
    },
    category: {
        type: String,
        require: true,
    },
    docUpload: {
        type: String,
        require: true,
    },
}, {timestamps: true})

const documentModel = mongoose.model("Document", documentSchema);
module.exports = documentModel;