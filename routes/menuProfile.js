let express = require("express");
let MenuProfile = require("../controllers/menuProfile");
let api = express.Router();

api.post("/menu-profile/add", MenuProfile.addMenuProfile);
api.get("/menu-profile/list", MenuProfile.listMenuProfiles);
api.post("/menu-profile/:description?", MenuProfile.listMenuProfiles);
api.put('/menu-profile/:id', MenuProfile.updateMenuProfile);
api.delete('/menu-profile/:id', MenuProfile.deleteMenuProfile);

module.exports = api;