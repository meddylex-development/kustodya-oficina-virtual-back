let MenuProfile = require("../models/menuProfile");
let moment = require("moment");

/* ********** START - Add new menu by profile method ********** */
const addMenuProfile = (req, res) => {
    let params = req.body;
    let menuProfile_ = new MenuProfile();
    menuProfile_.idProfile = params.idProfile;
    menuProfile_.idMenu = params.idMenu;
    menuProfile_.description = params.description;
    menuProfile_.dateCreated = moment().valueOf();
    menuProfile_.dateUpdated = moment().valueOf();
    menuProfile_.save((err, menuProfile) => {
        if (err) {
            res.status(500).send({ msg: "Error al conectar al servidor", stateRequest: false });
        } else {
            if (menuProfile) {
                res.status(200).send({ menuProfile: menuProfile, stateRequest: true });
            } else {
                res.status(401).send({ msg: "No se pudo registrar el menu por perfil", stateRequest: false });
            }
        }
    });
};
/* *********** END - Add new menu by profile method *********** */
/* ********** START - List all menu by profile method ********** */
const listMenuProfiles = (req, res) => {
    let description = req.params["description"];
    MenuProfile.find({ description: new RegExp(description, "i") }, (err, dataMenuProfile) => {
        if (err) {
          res.status(500).send({ msg: "Error al conectar al servidor", stateRequest: false });
        } else {
          if (dataMenuProfile) {
            res.status(200).send({ menuProfile: dataMenuProfile, stateRequest: true });
          } else {
            res.status(401).send({ msg: "No existen menus por perfil", stateRequest: false });
          }
        }
    });
};
/* *********** END - List all menu by profile method *********** */
/* ********** START - Update menu by profile method ********** */
const updateMenuProfile = (req, res) => {
    let id = req.params["id"];
    let params = req.body;
    MenuProfile.findByIdAndUpdate(
        { _id: id },
        { 
            idProfile: params.idProfile, 
            idMenu: params.idMenu, 
            description: params.description, 
            // dateCreated: parseInt(params.dateCreated), 
            dateUpdated: moment().valueOf(), 
        }, (err, dataMenuProfile) => {
            if (err) {
                res.status(500).send({ msg: "Error al conectar al servidor", stateRequest: false });
            } else {
                if (dataMenuProfile) {
                    res.status(200).send({ menuProfile: dataMenuProfile, stateRequest: true });
                } else {
                    res.status(403).send({ msg: "El menu por perfil no se pudo actualizar", stateRequest: false });
                }
            }
        }
    );
};
/* *********** END - Update menu by profile method *********** */
/* ********** START - Delete menu by profile method ********** */
const deleteMenuProfile = (req, res) => {
    let id = req.params["id"];
    let params = req.body;
    MenuProfile.deleteOne(
        { _id: id }, 
        (err, dataMenuProfile) => {
            if (err) {
                res.status(500).send({ msg: "Error al conectar al servidor", stateRequest: false });
            } else {
                if (dataMenuProfile) {
                    res.status(200).send({ state: dataMenuProfile, stateRequest: true });
                } else {
                    res.status(403).send({ msg: "El menu por perfil no se pudo eliminar", stateRequest: false });
                }
            }
        }
    );
};
/* *********** END - Delete menu by profile method *********** */

module.exports = {
    addMenuProfile,
    listMenuProfiles,
    updateMenuProfile,
    deleteMenuProfile,
};