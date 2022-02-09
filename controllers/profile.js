let Profile = require("../models/profile");
let moment = require("moment");

/* ********** START - Add new profile method ********** */
const addProfile = (req, res) => {
    let params = req.body;
    let profile_ = new Profile();
    profile_.idState = params.idState;
    profile_.name = params.name;
    profile_.description = params.description;
    profile_.dateCreated = moment().valueOf();
    profile_.dateUpdated = moment().valueOf();
    profile_.save((err, profileSaved) => {
        if (err) {
            res.status(500).send({ msg: "Error al conectar al servidor", stateRequest: false });
        } else {
            if (profileSaved) {
                res.status(200).send({ profile: profileSaved, stateRequest: true });
            } else {
                res.status(401).send({ msg: "No se pudo registrar el perfil", stateRequest: false });
            }
        }
    });
};
/* *********** END - Add new profile method *********** */
/* ********** START - List all profiles method ********** */
const listProfiles = (req, res) => {
    let name = req.params["name"];
    Profile.find({ name: new RegExp(name, "i") }, (err, dataProfile) => {
        if (err) {
          res.status(500).send({ msg: "Error al conectar al servidor", stateRequest: false });
        } else {
          if (dataProfile) {
            res.status(200).send({ profile: dataProfile, stateRequest: true });
          } else {
            res.status(401).send({ msg: "No existen profile", stateRequest: false });
          }
        }
    });
};
/* *********** END - List all profiles method *********** */
/* ********** START - Update profile method ********** */
const updateProfile = (req, res) => {
    let id = req.params["id"];
    let params = req.body;
    Profile.findByIdAndUpdate(
        { _id: id },
        { 
            idState: params.idState, 
            name: params.name, 
            description: params.description, 
            // dateCreated: parseInt(params.dateCreated), 
            dateUpdated: moment().valueOf(), 
        }, (err, dataProfile) => {
            if (err) {
                res.status(500).send({ msg: "Error al conectar al servidor", stateRequest: false });
            } else {
                if (dataProfile) {
                    res.status(200).send({ state: dataProfile, stateRequest: true });
                } else {
                    res.status(403).send({ msg: "El estado no se pudo actualizar", stateRequest: false });
                }
            }
        }
    );
};
/* *********** END - Update profile method *********** */
/* ********** START - Delete profile method ********** */
const deleteProfile = (req, res) => {
    let id = req.params["id"];
    let params = req.body;
    Profile.deleteOne(
        { _id: id }, 
        (err, dataProfile) => {
            if (err) {
                res.status(500).send({ msg: "Error al conectar al servidor", stateRequest: false });
            } else {
                if (dataProfile) {
                    res.status(200).send({ state: dataProfile, stateRequest: true });
                } else {
                    res.status(403).send({ msg: "El estado no se pudo eliminar", stateRequest: false });
                }
            }
        }
    );
};
/* *********** END - Delete profile method *********** */

module.exports = {
    addProfile,
    listProfiles,
    updateProfile,
    deleteProfile,
};