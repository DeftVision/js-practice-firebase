const mongoose = require("mongoose");

const schema = mongoose.Schema;

const documentSchema = new schema({
    title: {
        type: String,
        require: true,
    },
    category: {
        type: String,
        require: true,
    },
    downloadUrl: {
        type: String,
        require: true,
    },
    fileName:{
        type: String,
        require: true,
    }
}, {timestamps: true})

const documentModel = mongoose.model("Document", documentSchema);
module.exports = documentModel;