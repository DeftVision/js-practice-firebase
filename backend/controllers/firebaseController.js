const fbModel = require('../models/firebaseModel');

exports.newForm = async (req, res) => {
    try {
        const { name, fileUpload } = req.body;
        if(!name || !fileUpload) {
            return res.send({
                message: 'name and file are required',
            })
        }

        const file = new fbModel({name, fileUpload});
        await fbModel.save();
        return res.send({
            message: 'file form saved successfully',
            file,
        })
    }
    catch (error) {
        console.log(error);
        return res.send({
            message: 'Error creating form',
            error: error,
        })
    }
}

exports.getForms = async (req, res) => {
    try {
        const files = await fbModel.find({});
        if(!files) {
            return res.send({
                message: 'file not found',
            })
        } else {
            return res.send({
                fileCount: files.length,
                files,
            })
        }
    }
    catch (error) {
        console.log(error);
        return res.send({
            message: 'Error '
        })
    }
}

exports.getForm = async (req, res) => {
    try {
        const {id} = req.params;
        const file = await fbModel.findById(id);
        if(!file) {
            return res.send({
                message: 'file not found',
            })
        } else {
            return res.send({
                file,
            })
        }
    }
    catch (error) {
        console.log(error);
        return res.send({
            message: 'Error getting form',
        })
    }
}

exports.updateForm = async (req, res) => {
    try {
        const {id} = req.params;
        const {name, fileUpload} = req.body;
        const file = await fbModel.findByIdAndUpdate(id, req.body, {new: true});
        if(!file) {
            return res.send({
                message: 'file not saved',
            })
        }
        if(file) {
            return res.send({
                message: 'file saved successfully',
                file,
            })
        }
    }
    catch (error) {
        console.log(error);
        return res.send({
            message: 'Error updating form',
            error: error,
        })
    }
}