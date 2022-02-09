let express = require("express");
let City = require("../controllers/city");
let api = express.Router();

api.post("/city/add", City.addCity);
api.get("/city/list", City.listCities);
api.post("/city/:name?", City.listCities);
api.post("/city-by-id/:id?", City.listCitiesById);
api.put('/city/:id', City.updateCity);
api.delete('/city/:id', City.deleteCity);

module.exports = api;