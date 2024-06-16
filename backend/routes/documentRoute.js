const express = require("express");
const router = express.Router();

const {getDocuments, getDocument, deleteDocument, updateDocument, newDocument} = require("../controllers/documentController")


router.get("/documents", getDocuments)
router.get("/document/:id", getDocument)
router.post("/new-document", newDocument)
router.patch("/update/:id", updateDocument)
router.delete("/delete/:id", deleteDocument)


module.exports = router;