const documentModel = require("../models/documentModel");


exports.getDocuments = async (req, res) => {
    try {
        const documents = await documentModel.find({});
        if (!documents) {
            return res.send({
                message: "Documents not found"
            })
        }
        if (documents) {
            return res.send({
                documentCount: documents.length,
                documents,
            })

        }
    } catch (error) {
        console.log(error);
        return res.send({
            message: "getting documents callback error",
            error,
        })
    }
}

exports.getDocument = async (req, res) => {
    try {
        const {id} = req.params;
        const document = await documentModel.findById(id);
        if (!document) {
            return res.send({
                message: "Document not found",
            })
        }
        if (document) {
            return res.send({
                document,
            })
        }
    } catch (error) {
        console.log(error);
        return res.send({
            message: "getting document callback error",
            error,
        })
    }
}

exports.newDocument = async (req, res) => {
    try {
        const {docName, category, docUpload} = req.body;
        if (!docName || !category || !docUpload) {
            return res.send({
                message: "All fields are required"
            })
        }
        const document = new documentModel({docName, category, docUpload});
        await document.save();
        return res.send({

            message: "File uploaded successfully",
            document,
        })

    } catch (error) {
        console.log(error);
        return res.send({
            message: "creating document callback error",
            error,
        })
    }

}

exports.updateDocument = async (req, res) => {
    try {
        const {id} = req.params;
        const {docName, category, docUpload} = req.body;
        const document = await documentModel.findByIdAndUpdate(id, req.body, {new: true});
        if (!document) {
            return res.send({
                message: "File wasn't saved"
            })
        }
        if (document) {
            return res.send({
                message: "File was saved successfully.",
                document,
            })
        }
    } catch (error) {
        console.log(error);
        return res.send({
            message: "updating document callback error",
            error,
        })
    }
}

exports.deleteDocument = async (req, res) => {
    try {
        const {id} = req.params;
        const document = await documentModel.findByIdAndDelete(id);
        if (document) {
            return res.send({
                message: "File was deleted successfully",
            })
        } else {
            return res.send({
                message: "Deleting file failed."
            })
        }
    } catch (error) {
        console.log(error);
        return res.send({
            message: "deleting document callback error",
            error,
        })
    }
}



