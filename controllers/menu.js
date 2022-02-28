let Menu = require("../models/menu");
let moment = require("moment");

/* ********** START - Add new menu method ********** */
const addMenu = (req, res) => {
    let params = req.body;
    let menu_ = new Menu();
    menu_.idState = params.idState;
    menu_.name = params.name;
    menu_.title = params.title;
    menu_.icon = params.icon;
    menu_.link = params.link;
    menu_.home = params.home;
    menu_.description = params.description;
    menu_.dateCreated = moment().valueOf();
    menu_.dateUpdated = moment().valueOf();
    menu_.save((err, menuSaved) => {
        if (err) {
            res.status(500).send({ msg: "Error al conectar al servidor", stateRequest: false });
        } else {
            if (menuSaved) {
                res.status(200).send({ data: menuSaved, stateRequest: true });
            } else {
                res.status(401).send({ msg: "No se pudo registrar el menú", stateRequest: false });
            }
        }
    });
};
/* *********** END - Add new menu method *********** */
/* ********** START - List all menus method ********** */
const listMenus = (req, res) => {
    let name = req.params["name"];
    Menu.find({ name: new RegExp(name, "i") }, (err, dataMenu) => {
        if (err) {
          res.status(500).send({ msg: "Error al conectar al servidor", stateRequest: false });
        } else {
          if (dataMenu) {
            res.status(200).send({ data: dataMenu, stateRequest: true });
          } else {
            res.status(401).send({ msg: "No existen menú", stateRequest: false });
          }
        }
    });
};
/* *********** END - List all menus method *********** */
/* ********** START - List all Menus by id method ********** */
const listMenusById = (req, res) => {
    let idMenu = req.params["id"];
    Menu.find({ _id: idMenu }, (err, dataMenu) => {
        if (err) {
          res.status(500).send({ msg: "Error al conectar al servidor", stateRequest: false });
        } else {
          if (dataMenu) {
            res.status(200).send({ data: dataMenu, stateRequest: true });
          } else {
            res.status(401).send({ msg: "No existen menus", stateRequest: false });
          }
        }
    });
};
/* *********** END - List all Menus by id method *********** */
/* ********** START - Update profile method ********** */
const updateMenu = (req, res) => {
    let id = req.params["id"];
    let params = req.body;
    Menu.findByIdAndUpdate(
        { _id: id },
        { 
            idState: params.idState, 
            name: params.name, 
            title: params.title, 
            icon: params.icon, 
            link: params.link, 
            home: params.home, 
            description: params.description, 
            // dateCreated: parseInt(params.dateCreated), 
            dateUpdated: moment().valueOf(), 
        }, (err, dataMenu) => {
            if (err) {
                res.status(500).send({ msg: "Error al conectar al servidor", stateRequest: false });
            } else {
                if (dataMenu) {
                    res.status(200).send({ data: dataMenu, stateRequest: true });
                } else {
                    res.status(403).send({ msg: "El estado no se pudo actualizar", stateRequest: false });
                }
            }
        }
    );
};
/* *********** END - Update profile method *********** */
/* ********** START - Delete profile method ********** */
const deleteMenu = (req, res) => {
    let id = req.params["id"];
    let params = req.body;
    Menu.deleteOne(
        { _id: id }, 
        (err, dataMenu) => {
            if (err) {
                res.status(500).send({ msg: "Error al conectar al servidor", stateRequest: false });
            } else {
                if (dataMenu) {
                    res.status(200).send({ data: dataMenu, stateRequest: true });
                } else {
                    res.status(403).send({ msg: "El estado no se pudo eliminar", stateRequest: false });
                }
            }
        }
    );
};
/* *********** END - Delete profile method *********** */

module.exports = {
    addMenu,
    listMenus,
    listMenusById,
    updateMenu,
    deleteMenu,
};