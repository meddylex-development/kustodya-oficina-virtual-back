let express = require("express");
let Country = require("../controllers/country");
let api = express.Router();

api.post("/country/add", Country.addCountry);
api.get("/country/list", Country.listCountries);
api.post("/country/:name?", Country.listCountries);
api.post("/country-by-id/:id?", Country.listCountriesById);
api.put('/country/:id', Country.updateCountry);
api.delete('/country/:id', Country.deleteCountry);

module.exports = api;