let express = require("express");
let User = require("../controllers/user");
let api = express.Router();

api.post("/user/sign-in", User.userSignIn);
api.post("/user/sign-up", User.userSignUp);
api.post("/user/sign-up-auth", User.userSignUpAuth);
api.get("/user/list", User.userList);
api.post("/user/:documentNumber?", User.userList);
api.post("/user/data-user/:id?", User.fnGetDataUserById);
api.put('/user/:id', User.userUpdate);
api.get('/user/activate-user/:token', User.activateUser);
api.delete('/user/:id', User.deleteUser);

module.exports = api;