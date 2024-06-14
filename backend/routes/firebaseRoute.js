const express = require('express');
const router = express.Router();


const { getForm, getForms, newForm, updateForm  } = require('../controllers/firebaseController')


router.get('/forms', getForms)
router.get('/form/:id', getForm);
router.post('/create', newForm);
router.put('/update/:id', updateForm);


module.exports = router;