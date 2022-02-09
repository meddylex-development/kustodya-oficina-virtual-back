let Country = require("../models/country");
let moment = require("moment");

/* ********** START - Add new country method ********** */
const addCountry = (req, res) => {
    let params = req.body;
    let country_ = new Country();
    country_.idState = params.idState;
    country_.name = params.name;
    country_.description = params.description;
    country_.dateCreated = moment().valueOf();
    country_.dateUpdated = moment().valueOf();
    country_.save((err, countrySaved) => {
        if (err) {
            res.status(500).send({ msg: "Error al conectar al servidor", stateRequest: false });
        } else {
            if (countrySaved) {
                res.status(200).send({ data: countrySaved, stateRequest: true });
            } else {
                res.status(401).send({ msg: "No se pudo registrar el país", stateRequest: false });
            }
        }
    });
};
/* *********** END - Add new country method *********** */
/* ********** START - List all countries method ********** */
const listCountries = (req, res) => {
    let name = req.params["name"];
    Country.find({ name: new RegExp(name, "i") }, (err, dataCountry) => {
        if (err) {
          res.status(500).send({ msg: "Error al conectar al servidor", stateRequest: false });
        } else {
          if (dataCountry) {
            res.status(200).send({ data: dataCountry, stateRequest: true });
          } else {
            res.status(401).send({ msg: "No existen paises", stateRequest: false });
          }
        }
    });
};
/* *********** END - List all countries method *********** */
/* ********** START - List all cities method ********** */
const listCountriesById = (req, res) => {
    let idCountry = req.params["id"];
    Country.find({ _id: idCountry }, (err, dataCountry) => {
        if (err) {
          res.status(500).send({ msg: "Error al conectar al servidor", stateRequest: false });
        } else {
          if (dataCountry) {
            res.status(200).send({ data: dataCountry, stateRequest: true });
          } else {
            res.status(401).send({ msg: "No existen ciudades", stateRequest: false });
          }
        }
    });
};
/* *********** END - List all cities method *********** */
/* ********** START - Update country method ********** */
const updateCountry = (req, res) => {
    let id = req.params["id"];
    let params = req.body;
    Country.findByIdAndUpdate(
        { _id: id },
        { 
            idState: params.idState, 
            name: params.name, 
            description: params.description, 
            // dateCreated: parseInt(params.dateCreated), 
            dateUpdated: moment().valueOf(), 
        }, (err, dataCountry) => {
            if (err) {
                res.status(500).send({ msg: "Error al conectar al servidor", stateRequest: false });
            } else {
                if (dataCountry) {
                    res.status(200).send({ data: dataCountry, stateRequest: true });
                } else {
                    res.status(403).send({ msg: "El país no se pudo actualizar", stateRequest: false });
                }
            }
        }
    );
};
/* *********** END - Update country method *********** */
/* ********** START - Delete country method ********** */
const deleteCountry = (req, res) => {
    let id = req.params["id"];
    let params = req.body;
    Country.deleteOne(
        { _id: id }, 
        (err, dataCountry) => {
            if (err) {
                res.status(500).send({ msg: "Error al conectar al servidor", stateRequest: false });
            } else {
                if (dataCountry) {
                    res.status(200).send({ data: dataCountry, stateRequest: true });
                } else {
                    res.status(403).send({ msg: "El país no se pudo eliminar", stateRequest: false });
                }
            }
        }
    );
};
/* *********** END - Delete country method *********** */

module.exports = {
    addCountry,
    listCountries,
    listCountriesById,
    updateCountry,
    deleteCountry,
};