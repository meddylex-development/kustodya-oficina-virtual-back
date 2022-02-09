let express = require("express");
let DocumentType = require("../controllers/documentType");
let api = express.Router();

api.post("/document-type/add", DocumentType.addDocumentType);
api.get("/document-type/list", DocumentType.listDocumentTypes);
api.post("/document-type/:name?", DocumentType.listDocumentTypes);
api.put('/document-type/:id', DocumentType.updateDocumentType);
api.delete('/document-type/:id', DocumentType.deleteDocumentType);

module.exports = api;