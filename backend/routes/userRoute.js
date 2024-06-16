const express = require('express');
const router = express.Router();

const { getUsers, getUser, createUser} = require('../controllers/userController');

router.get('/users', getUsers);
router.get('/user/:id', getUser);
router.post('/create-user', createUser);

module.exports = router;
