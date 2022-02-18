let State = require("../models/state");
let moment = require("moment");
let Utilities = require('../utils/utilities');
const { response } = require("express");

/* ********** START - Add new state method ********** */
const addState = (req, res) => {
    let params = req.body;
    let state_ = new State();
    state_.name = params.name;
    state_.description = params.description;
    state_.dateCreated = moment().valueOf();
    state_.dateUpdated = moment().valueOf();
    state_.save((err, stateSaved) => {
        if (err) {
            res.status(500).send({ msg: "Error al conectar al servidor", stateRequest: false });
        } else {
            if (stateSaved) {
                res.status(200).send({ state: stateSaved, stateRequest: true });
            } else {
                res.status(401).send({ msg: "No se pudo registrar el estado", stateRequest: false });
            }
        }
    });
};
/* *********** END - Add new state method *********** */
/* ********** START - List all states method ********** */
const listStates = (req, res) => {
    let tokenUser = req.headers.authorization || '';
    Utilities.fnUserSystemValid(tokenUser).then((responseAuth) => {
        console.log('responseAuth: ', responseAuth);
        if (!responseAuth) {
            res.status(401).send({ msg: "La sesión ha expirado", stateRequest: false });
        } else {
            let name = req.params["name"];
            State.find({ name: new RegExp(name, "i") }, (err, dataState) => {
                if (err) {
                  res.status(500).send({ msg: "Error al conectar al servidor", stateRequest: false });
                } else {
                  if (dataState) {
                    res.status(200).send({ state: dataState, stateRequest: true });
                  } else {
                    res.status(401).send({ msg: "No existen estados", stateRequest: false });
                  }
                }
            });
        }
    });
};
/* *********** END - List all states method *********** */
/* ********** START - List all states method ********** */
const listStatesById = (req, res) => {
    let isState = req.params["id"];
    State.find({ _id: isState }, (err, dataState) => {
        if (err) {
          res.status(500).send({ msg: "Error al conectar al servidor", stateRequest: false });
        } else {
          if (dataState) {
            res.status(200).send({ state: dataState, stateRequest: true });
          } else {
            res.status(401).send({ msg: "No existen estados", stateRequest: false });
          }
        }
    });
};
/* *********** END - List all states method *********** */
/* ********** START - Update state method ********** */
const updateState = (req, res) => {
    let id = req.params["id"];
    let params = req.body;
    State.findByIdAndUpdate(
        { _id: id },
        { 
            name: params.name, 
            description: params.description, 
            // dateCreated: parseInt(params.dateCreated), 
            dateUpdated: moment().valueOf(), 
        }, (err, dataState) => {
            if (err) {
                res.status(500).send({ msg: "Error al conectar al servidor", stateRequest: false });
            } else {
                if (dataState) {
                    res.status(200).send({ state: dataState, stateRequest: true });
                } else {
                    res.status(403).send({ msg: "El estado no se pudo actualizar", stateRequest: false });
                }
            }
        }
    );
};
/* *********** END - Update state method *********** */
/* ********** START - Delete state method ********** */
const deleteState = (req, res) => {
    let id = req.params["id"];
    let params = req.body;
    State.deleteOne(
        { _id: id }, 
        (err, dataState) => {
            if (err) {
                res.status(500).send({ msg: "Error al conectar al servidor", stateRequest: false });
            } else {
                if (dataState) {
                    res.status(200).send({ state: dataState, stateRequest: true });
                } else {
                    res.status(403).send({ msg: "El estado no se pudo eliminar", stateRequest: false });
                }
            }
        }
    );
};
/* *********** END - Delete state method *********** */
/* ********** START - Delete all states method ********** */
const deleteAllState = (req, res) => {
    // let id = req.params["id"];
    let params = req.body;
    console.log('params: ', params);
    State.deleteMany(
        {}, 
        (err, dataState) => {
            if (err) {
                res.status(500).send({ msg: "Error al conectar al servidor", stateRequest: false });
            } else {
                if (dataState) {
                    res.status(200).send({ state: dataState, stateRequest: true });
                } else {
                    res.status(403).send({ msg: "El estado no se pudo eliminar", stateRequest: false });
                }
            }
        }
    );
};
/* *********** END - Delete all states method *********** */

module.exports = {
    addState,
    listStates,
    listStatesById,
    updateState,
    deleteState,
    deleteAllState,
};