const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");

exports.getUsers = async (req, res) => {
    try {
        const users = await userModel.find({});
        if(!users) {
            return res.send({
                message: 'no user found'
            })
        } else {
            return res.send({
                userCount: users.length,
                users,
            })
        }
    }
    catch (error) {
        console.log(error);
        return res.send({
            message: 'Error creating user',
            error: error,
        })
    }
}

exports.getUser = async (req, res) => {
    try {
        const {id} = req.params;
        const user = await userModel.findById(id);
        if(!user) {
            return res.send({
                message: 'user not found',
            })
        } else {
            return res.send({
                user,
            })
        }
    }
    catch (error) {
        console.log(error);
        return res.send({
            message: 'Error finding user',
            error: error,
        })
    }
}

exports.createUser = async (req, res) => {
    try {
        const {firstName, lastName, email, password} = req.body;
        if(!firstName || !lastName || !email || !password) {
            return res.send({
                message: 'All fields are required',
            })
        } else {
            const existingUser = await userModel.findOne({email});
            if(existingUser) {
                return res.send({
                    message: 'User already exists',
                })
            }

            const hashedPassword = await bcrypt.hash(password, 14);
            const user = new userModel({firstName, lastName, email, password: hashedPassword});
            await user.save();
            return res.send({
                message: 'User created successfully',
                user,
            })
        }
    } catch (error) {
        console.log(error);
        return res.send({
            message: 'Error creating user',
            error: error,
        })
    }
}
