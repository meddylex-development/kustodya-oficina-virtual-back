let AuditTrack = require("../models/auditTrack");
let moment = require("moment");

/* ********** START - Add new audit track action method ********** */
const addAuditTrack = (req, res) => {
    let params = req.body;
    let auditTrack_ = new AuditTrack();
    auditTrack_.idUser = params.idUser;
    auditTrack_.idState = params.idState;
    auditTrack_.module = params.module;
    auditTrack_.description = params.description;
    auditTrack_.dateCreated = moment().valueOf();
    auditTrack_.dateUpdated = moment().valueOf();
    auditTrack_.save((err, auditTrackSaved) => {
        if (err) {
            res.status(500).send({ msg: "Error al conectar al servidor", stateRequest: false });
        } else {
            if (auditTrackSaved) {
                res.status(200).send({ auditTrack: auditTrackSaved, stateRequest: true });
            } else {
                res.status(401).send({ msg: "No se pudo registrar la accion de auditoria", stateRequest: false });
            }
        }
    });
};
/* *********** END - Add new audit track action method *********** */
/* ********** START - List all track actions method ********** */
const listAuditTrack = (req, res) => {
    let description = req.params["description"];
    AuditTrack.find({ description: new RegExp(description, "i") }, (err, dataAuditTrack) => {
        if (err) {
          res.status(500).send({ msg: "Error al conectar al servidor", stateRequest: false });
        } else {
          if (dataAuditTrack) {
            res.status(200).send({ auditTrack: dataAuditTrack, stateRequest: true });
          } else {
            res.status(401).send({ msg: "No existen registros de auditoria", stateRequest: false });
          }
        }
    });
};
/* *********** END - List all track actions method *********** */
/* ********** START - Update audit track action method ********** */
const updateAuditTrack = (req, res) => {
    let id = req.params["id"];
    let params = req.body;
    AuditTrack.findByIdAndUpdate(
        { _id: id },
        { 
            idUser: params.idUser,
            idState: params.idState,
            module: params.module,
            description: params.description,
            // dateCreated: parseInt(params.dateCreated), 
            dateUpdated: moment().valueOf(), 
        }, (err, dataAuditTrack) => {
            if (err) {
                res.status(500).send({ msg: "Error al conectar al servidor", stateRequest: false });
            } else {
                if (dataAuditTrack) {
                    res.status(200).send({ auditTrack: dataAuditTrack, stateRequest: true });
                } else {
                    res.status(403).send({ msg: "El estado no se pudo actualizar", stateRequest: false });
                }
            }
        }
    );
};
/* *********** END - Update audit track action method *********** */
/* ********** START - Delete audit track action method ********** */
const deleteAuditTrack = (req, res) => {
    let id = req.params["id"];
    let params = req.body;
    AuditTrack.deleteOne(
        { _id: id }, 
        (err, dataAuditTrack) => {
            if (err) {
                res.status(500).send({ msg: "Error al conectar al servidor", stateRequest: false });
            } else {
                if (dataAuditTrack) {
                    res.status(200).send({ auditTrack: dataAuditTrack, stateRequest: true });
                } else {
                    res.status(403).send({ msg: "El registro de auditoria no se pudo eliminar", stateRequest: false });
                }
            }
        }
    );
};
/* *********** END - Delete audit track action method *********** */

module.exports = {
    addAuditTrack,
    listAuditTrack,
    updateAuditTrack,
    deleteAuditTrack,
};