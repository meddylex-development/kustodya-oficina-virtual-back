let express = require("express");
let State = require("../controllers/state");
let api = express.Router();

api.post("/state/add", State.addState);
api.get("/state/list", State.listStates);
api.post("/state/:name?", State.listStates);
api.post("/state-by-id/:id?", State.listStatesById);
api.put('/state/:id', State.updateState);
api.delete('/state/:id', State.deleteState);
api.delete('/state/list', State.deleteAllState);

module.exports = api;