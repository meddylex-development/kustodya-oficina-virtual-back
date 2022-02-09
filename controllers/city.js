let City = require("../models/city");
let moment = require("moment");

/* ********** START - Add new city method ********** */
const addCity = (req, res) => {
    let params = req.body;
    let city_ = new City();
    city_.idState = params.idState;
    city_.idCountry = params.idCountry;
    city_.name = params.name;
    city_.description = params.description;
    city_.dateCreated = moment().valueOf();
    city_.dateUpdated = moment().valueOf();
    city_.save((err, citySaved) => {
        if (err) {
            res.status(500).send({ msg: "Error al conectar al servidor", stateRequest: false });
        } else {
            if (citySaved) {
                res.status(200).send({ data: citySaved, stateRequest: true });
            } else {
                res.status(401).send({ msg: "No se pudo registrar la ciudad", stateRequest: false });
            }
        }
    });
};
/* *********** END - Add new city method *********** */
/* ********** START - List all cities method ********** */
const listCities = (req, res) => {
    let name = req.params["name"];
    City.find({ name: new RegExp(name, "i") }, (err, dataCity) => {
        if (err) {
          res.status(500).send({ msg: "Error al conectar al servidor", stateRequest: false });
        } else {
          if (dataCity) {
            res.status(200).send({ data: dataCity, stateRequest: true });
          } else {
            res.status(401).send({ msg: "No existen ciudades", stateRequest: false });
          }
        }
    });
};
/* *********** END - List all cities method *********** */
/* ********** START - List all cities method ********** */
const listCitiesById = (req, res) => {
    let idCity = req.params["id"];
    City.find({ _id: idCity }, (err, dataCity) => {
        if (err) {
          res.status(500).send({ msg: "Error al conectar al servidor", stateRequest: false });
        } else {
          if (dataCity) {
            res.status(200).send({ data: dataCity, stateRequest: true });
          } else {
            res.status(401).send({ msg: "No existen ciudades", stateRequest: false });
          }
        }
    });
};
/* *********** END - List all cities method *********** */
/* ********** START - Update city method ********** */
const updateCity = (req, res) => {
    let id = req.params["id"];
    let params = req.body;
    City.findByIdAndUpdate(
        { _id: id },
        { 
            idState: params.idState, 
            name: params.name, 
            description: params.description, 
            // dateCreated: parseInt(params.dateCreated), 
            dateUpdated: moment().valueOf(), 
        }, (err, dataCity) => {
            if (err) {
                res.status(500).send({ msg: "Error al conectar al servidor", stateRequest: false });
            } else {
                if (dataCity) {
                    res.status(200).send({ data: dataCity, stateRequest: true });
                } else {
                    res.status(403).send({ msg: "La ciudad no se pudo actualizar", stateRequest: false });
                }
            }
        }
    );
};
/* *********** END - Update city method *********** */
/* ********** START - Delete city method ********** */
const deleteCity = (req, res) => {
    let id = req.params["id"];
    let params = req.body;
    City.deleteOne(
        { _id: id }, 
        (err, dataCity) => {
            if (err) {
                res.status(500).send({ msg: "Error al conectar al servidor", stateRequest: false });
            } else {
                if (dataCity) {
                    res.status(200).send({ data: dataCity, stateRequest: true });
                } else {
                    res.status(403).send({ msg: "La ciudad no se pudo eliminar", stateRequest: false });
                }
            }
        }
    );
};
/* *********** END - Delete city method *********** */

module.exports = {
    addCity,
    listCities, 
    listCitiesById, 
    updateCity,
    deleteCity,
};