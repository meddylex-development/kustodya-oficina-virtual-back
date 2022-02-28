let express = require("express");
let Profile = require("../controllers/profile");
let api = express.Router();

api.post("/profile/add", Profile.addProfile);
api.get("/profile/list", Profile.listProfiles);
api.post("/profile/:name?", Profile.listProfiles);
api.post("/profile-by-id/:id?", Profile.listProfilesById);
api.put('/profile/:id', Profile.updateProfile);
api.delete('/profile/:id', Profile.deleteProfile);

module.exports = api;