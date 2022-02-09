let DocumentType = require("../models/documentType");
let moment = require("moment");

/* ********** START - Add new document type method ********** */
const addDocumentType = (req, res) => {
    let params = req.body;
    let documentType_ = new DocumentType();
    documentType_.idState = params.idState;
    documentType_.name = params.name;
    documentType_.description = params.description;
    documentType_.dateCreated = moment().valueOf();
    documentType_.dateUpdated = moment().valueOf();
    documentType_.save((err, documentTypeSaved) => {
        if (err) {
            res.status(500).send({ msg: "Error al conectar al servidor", stateRequest: false });
        } else {
            if (documentTypeSaved) {
                res.status(200).send({ data: documentTypeSaved, stateRequest: true });
            } else {
                res.status(401).send({ msg: "No se pudo registrar el tipo de documento", stateRequest: false });
            }
        }
    });
};
/* *********** END - Add new document type method *********** */
/* ********** START - List all states method ********** */
const listDocumentTypes = (req, res) => {
    let name = req.params["name"];
    DocumentType.find({ name: new RegExp(name, "i") }, (err, dataDocumentType) => {
        if (err) {
          res.status(500).send({ msg: "Error al conectar al servidor", stateRequest: false });
        } else {
          if (dataDocumentType) {
            res.status(200).send({ data: dataDocumentType, stateRequest: true });
          } else {
            res.status(401).send({ msg: "No existen estados", stateRequest: false });
          }
        }
    });
};
/* *********** END - List all states method *********** */
/* ********** START - Update state method ********** */
const updateDocumentType = (req, res) => {
    let id = req.params["id"];
    let params = req.body;
    DocumentType.findByIdAndUpdate(
        { _id: id },
        { 
            idState: params.idState, 
            name: params.name, 
            description: params.description, 
            // dateCreated: parseInt(params.dateCreated), 
            dateUpdated: moment().valueOf(), 
        }, (err, dataDocumentType) => {
            if (err) {
                res.status(500).send({ msg: "Error al conectar al servidor", stateRequest: false });
            } else {
                if (dataDocumentType) {
                    res.status(200).send({ documentType: dataDocumentType, stateRequest: true });
                } else {
                    res.status(403).send({ msg: "El estado no se pudo actualizar", stateRequest: false });
                }
            }
        }
    );
};
/* *********** END - Update state method *********** */
/* ********** START - Delete state method ********** */
const deleteDocumentType = (req, res) => {
    let id = req.params["id"];
    let params = req.body;
    DocumentType.deleteOne(
        { _id: id }, 
        (err, dataDocumentType) => {
            if (err) {
                res.status(500).send({ msg: "Error al conectar al servidor", stateRequest: false });
            } else {
                if (dataDocumentType) {
                    res.status(200).send({ documentType: dataDocumentType, stateRequest: true });
                } else {
                    res.status(403).send({ msg: "El estado no se pudo eliminar", stateRequest: false });
                }
            }
        }
    );
};
/* *********** END - Delete state method *********** */

module.exports = {
    addDocumentType,
    listDocumentTypes,
    updateDocumentType,
    deleteDocumentType,
};