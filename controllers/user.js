let User = require("../models/user");
let bcrypt = require("bcrypt-nodejs");
let jwt = require("../libs/jwt");
let moment = require("moment");


const userSignIn = (req, res) => {
    let params = req.body;
    User.findOne({ email: params.email }, (err, dataUser) => {
        if (err) {
            res.status(500).send({ mensaje: "Error del servidor" });
        } else {
            if (dataUser) {
                bcrypt.compare(params.password, dataUser.password, (err, successDataCompare) => {
                    if (successDataCompare) {
                        if (dataUser.idState) {
                            if (params.getToken) {
                                res.status(200).send({ jwt: jwt.createToken(dataUser), user: dataUser });
                            } else {
                                res.status(200).send({ user: dataUser, mensaje: "Sin token" });
                            }
                        } else {
                            res.status(206).send({ user: dataUser, mensaje: "Usuario Inactivo" });
                        }
                    } else {
                        res.status(401).send({ mensaje: "Correo o Clave erronea" });
                    }
                });
            } else {
                res.status(401).send({ mensaje: "Correo o Clave erronea" });
            }
        }
    });
  };
/* ********** START - Add new user method ********** */
const userSignUp = (req, res) => {
    let params = req.body;
    let user_ = new User();
    if (
        params.idState &&
        params.idProfile &&
        params.firstName &&
        params.secondFirstName &&
        params.lastName &&
        params.secondLastName &&
        params.idDocumentType && 
        params.idCountry && 
        params.idCity && 
        params.documentNumber &&
        params.email &&
        params.password &&
        params.address &&
        params.phoneNumber &&
        params.birthDate
    ) {
      bcrypt.hash(params.password, null, null, (err, hash) => {
        if (hash) {
            user_.idState = params.idState;
            user_.idProfile = params.idProfile;
            user_.firstName = params.firstName;
            user_.secondFirstName = params.secondFirstName;
            user_.lastName = params.lastName;
            user_.secondLastName = params.secondLastName;
            user_.idDocumentType = params.idDocumentType;
            user_.idCountry = params.idCountry;
            user_.idCity = params.idCity;
            user_.documentNumber = params.documentNumber;
            user_.email = params.email;
            user_.password = hash;
            user_.address = params.address;
            user_.phoneNumber = params.phoneNumber;
            user_.birthDate = params.birthDate;
            user_.dateCreated = moment().unix();
            user_.dateUpdated = moment().unix();
            user_.save((err, userSaved) => {
                if (err) {
                    res.status(500).send({ err: "No se registro el usuario", state: false });
                } else {
                    res.status(200).send({ user: userSaved, state: true });
                }
            });
        }
      });
    } else {
        res.status(405).send({ err: "No se guardo un dato" });
    }
};
/* *********** END - Add new user method *********** */
/* ********** START - List all users method ********** */
const userList = (req, res) => {
    let documentNumber = req.params["documentNumber"];
    User.find({ documentNumber: new RegExp(documentNumber, "i") }, (err, dataUser) => {
        if (err) {
          res.status(500).send({ msg: "Error al conectar al servidor", stateRequest: false });
        } else {
          if (dataUser) {
            res.status(200).send({ user: dataUser, stateRequest: true });
          } else {
            res.status(401).send({ msg: "No existe el usuario", stateRequest: false });
          }
        }
    });
};
/* *********** END - List all users method *********** */
/* ********** START - Update user method ********** */
const userUpdate = (req, res) => {
    let id = req.params["id"];
    let params = req.body;
    User.findByIdAndUpdate(
        { _id: id },
        { 
            idState: params.idState,
            idProfile: params.idProfile,
            firstName: params.firstName,
            secondFirstName: params.secondFirstName,
            lastName: params.lastName,
            secondLastName: params.secondLastName,
            idDocumentType: params.idDocumentType,
            idCountry: params.idCountry,
            idCity: params.idCity,
            documentNumber: params.documentNumber,
            email: params.email,
            address: params.address,
            phoneNumber: params.phoneNumber,
            birthDate: params.birthDate,
            // dateCreated: parseInt(params.dateCreated), 
            dateUpdated: moment().valueOf(), 
        }, (err, dataUser) => {
            if (err) {
                res.status(500).send({ msg: "Error al conectar al servidor", stateRequest: false });
            } else {
                if (dataUser) {
                    res.status(200).send({ user: dataUser, stateRequest: true });
                } else {
                    res.status(403).send({ msg: "El usuario no se pudo actualizar", stateRequest: false });
                }
            }
        }
    );
};
/* *********** END - Update user method *********** */
/* ********** START - Delete user method ********** */
const deleteUser = (req, res) => {
    let id = req.params["id"];
    let params = req.body;
    User.deleteOne(
        { _id: id }, 
        (err, dataUser) => {
            if (err) {
                res.status(500).send({ msg: "Error al conectar al servidor", stateRequest: false });
            } else {
                if (dataUser) {
                    res.status(200).send({ user: dataUser, stateRequest: true });
                } else {
                    res.status(403).send({ msg: "El usuario no se pudo eliminar", stateRequest: false });
                }
            }
        }
    );
};
/* *********** END - Delete user method *********** */

module.exports = {
    userSignIn,
    userSignUp,
    userList,
    userUpdate,
    deleteUser,
};