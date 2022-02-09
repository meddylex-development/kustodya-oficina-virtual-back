let express = require("express");
let Menu = require("../controllers/menu");
let api = express.Router();

api.post("/menu/add", Menu.addMenu);
api.get("/menu/list", Menu.listMenus);
api.post("/menu/:name?", Menu.listMenus);
api.put('/menu/:id', Menu.updateMenu);
api.delete('/menu/:id', Menu.deleteMenu);

module.exports = api;