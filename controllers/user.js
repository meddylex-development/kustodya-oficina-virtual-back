let User = require("../models/user");
let Utilities = require("../utils/utilities");
let bcrypt = require("bcrypt-nodejs");
let jwt = require("../libs/jwt");
let moment = require("moment");
const e = require("express");

/* ********** START - Login / Auth user method ********** */
const userSignIn = (req, res) => {
    let params = req.body;
    User.findOne({ email: params.email }, (err, dataUser) => {
        if (err) {
            res.status(500).send({ mensaje: "Error del servidor" });
        } else {
            let statusActive = (dataUser) ? dataUser['userActiveRegister'] : null;
            if (!statusActive || statusActive == null) {
                res.status(403).send({ user: null, mensaje: "La cuenta no se ha activado aun!" });
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
        }
    });
};
/* *********** END - Login / Auth user method *********** */
/* ********** START - Find user by id method ********** */
const findUserById = (id) => {
    return new Promise ((resolve, reject) => {
        User.findOne({ _id: id }, (err, dataUser) => {
            if (err) {
                reject(err);
            } else {
                resolve(dataUser);
            }
        });
    });
}
/* *********** END - Find user by id method *********** */
/* ********** START - Find user by email method ********** */
const findUserByEmail = (email) => {
    return new Promise ((resolve, reject) => {
        User.findOne({ email: email }, (err, dataUser) => {
            if (err) {
                reject(err);
            } else {
                resolve(dataUser);
            }
        });
    });
}
/* *********** END - Find user by email method *********** */
/* ********** START - Find user by document number method ********** */
const findUserByDocumentNumber = (documentNumber) => {
    return new Promise ((resolve, reject) => {
        User.findOne({ documentNumber: documentNumber }, (err, dataUser) => {
            if (err) {
                reject({ data: err, state: false });
            } else {
                resolve({ data: dataUser, state: true });
            }
        });
    });
}
/* *********** END - Find user by document number method *********** */
/* ********** START - Find user by document number method ********** */
const userSignUp = (req, res) => {
    let params = req.body;
    let user_ = new User();
    if (
        params.idState &&
        params.idProfile &&
        params.firstName &&
        // params.secondFirstName &&
        params.lastName &&
        // params.secondLastName &&
        params.idDocumentType && 
        // params.idCountry && 
        // params.idCity && 
        params.documentNumber && 
        params.documentDateExpedition && 
        params.email &&
        params.password &&
        // params.address &&
        params.phoneNumber &&
        // params.birthDate && 
        params.acceptTerms && 
        params.captcha
    ) {

        findUserByDocumentNumber(params.documentNumber).then((response) => {
            if (response.data) {
                
                // Envia un mail indicando que ese usuario ya existe y que revise el correo *******algo@dominio.com
                let emailEncripted = Utilities.encriptEmailUser(response['data']['email']);
                res.status(202).send({ data: "usuario ya existe!\n Inicia sesion con " + emailEncripted, state: false });

            } else {
                findUserByEmail(params.email).then((respEmail) => {
                    if (respEmail) {
                    
                        let emailEncripted = Utilities.encriptEmailUser(respEmail['email']);
                        res.status(202).send({ data: "El correo electrónico ya se encuentra registrado!\n Inicia sesion con " + emailEncripted, state: false });

                    } else {
                        bcrypt.hash(params.password, null, null, (err, hash) => {
                            if (hash) {
                                user_.idState = params.idState;
                                user_.idProfile = params.idProfile;
                                user_.firstName = params.firstName;
                                user_.secondFirstName = params.secondFirstName || '';
                                user_.lastName = params.lastName;
                                user_.secondLastName = params.secondLastName || '';
                                user_.idDocumentType = params.idDocumentType;
                                // user_.idCountry = params.idCountry || '';
                                // user_.idCity = params.idCity || '';
                                user_.documentNumber = params.documentNumber;
                                user_.documentDateExpedition = params.documentDateExpedition;
                                user_.email = params.email;
                                user_.password = hash;
                                user_.address = params.address;
                                user_.phoneNumber = params.phoneNumber;
                                user_.birthDate = params.birthDate || '';
                                user_.acceptTerms = params.acceptTerms;
                                user_.captcha = params.captcha;
                                user_.userActiveRegister = false;
                                user_.dateCreated =  moment().valueOf();;
                                user_.dateUpdated =  moment().valueOf();;
                                user_.save((err, userSaved) => {
                                    if (err) {
                                        res.status(500).send({ err: "No se registro el usuario 1", state: false });
                                    } else {

                                        fnSendMailTemplate(userSaved, "templates/auth/active-user.html", "Activar Cuenta - Oficina virtual", params.email, params.password).then(resp => {
                                            if (resp.state) {
                                                res.status(200).send({ data: userSaved, state: true });
                                            } else {
                                                res.status(500).send({ err: "No se registro el usuario 2", state: false });
                                            }
                                        }).catch(err => {
                                            res.status(500).send({ err: "Ocurrio un error!", state: false });
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });

    } else {
        res.status(405).send({ err: "No se guardo un dato" });
    }
};
/* *********** END - Add new user method *********** */
/* ********** START - Add new user method ********** */
const userSignUpAuth = (req, res) => {
    let params = req.body;
    let user_ = new User();
    if (params.idDocumentType && 
        params.documentNumber && 
        params.documentDateExpedition && 
        params.email &&
        params.password &&
        params.phoneNumber && 
        params.acceptTerms && 
        params.captcha
    ) {
        findUserByDocumentNumber(params.documentNumber).then((response) => {
            if (response.data) {
                
                // Envia un mail indicando que ese usuario ya existe y que revise el correo *******algo@dominio.com
                let emailEncripted = Utilities.encriptEmailUser(response['data']['email']);
                res.status(202).send({ data: "usuario ya existe!\n Inicia sesion con " + emailEncripted, state: false });

            } else {
                findUserByEmail(params.email).then((respEmail) => {
                    if (respEmail) {
                    
                        let emailEncripted = Utilities.encriptEmailUser(respEmail['email']);
                        res.status(202).send({ data: "El correo electrónico ya se encuentra registrado!\n Inicia sesion con " + emailEncripted, state: false });

                    } else {
                        bcrypt.hash(params.password, null, null, (err, hash) => {
                            if (hash) {
                                user_.idState = "615f20434aadd813ca760d0d";
                                user_.idProfile = "620ad0217bbe001342fa4ed3";
                                user_.firstName = "";
                                user_.secondFirstName = "";
                                user_.lastName = "";
                                user_.secondLastName = "";
                                user_.idDocumentType = params.idDocumentType;
                                // user_.idCountry = "";
                                // user_.idCity = "";
                                user_.documentNumber = params.documentNumber;
                                user_.documentDateExpedition = params.documentDateExpedition;
                                user_.email = params.email;
                                user_.password = hash;
                                user_.address = "";
                                user_.phoneNumber = params.phoneNumber;
                                user_.birthDate = "";
                                user_.acceptTerms = params.acceptTerms;
                                user_.captcha = params.captcha;
                                user_.userActiveRegister = false;
                                user_.dateCreated =  moment().valueOf();;
                                user_.dateUpdated =  moment().valueOf();;
                                user_.save((err, userSaved) => {
                                    if (err) {
                                        res.status(500).send({ err: "No se registro el usuario 1", state: false });
                                    } else {

                                        fnSendMailTemplate(userSaved, "templates/auth/email-activate-account.html", "Activar Cuenta - Oficina virtual", params.email, null).then(resp => {
                                            if (resp.state) {
                                                res.status(200).send({ data: userSaved, state: true });
                                            } else {
                                                res.status(500).send({ err: "No se registro el usuario 2", state: false });
                                            }
                                        }).catch(err => {
                                            res.status(500).send({ err: "Ocurrio un error!", state: false });
                                        });
                                        
                                        // let templateEmailToSend = 'templates/auth/active-user.html';
                                        // let emailSubject = 'Activar Cuenta - Oficina virtual';
                                        // let obj = {
                                        //     '_id': userSaved['_id'],
                                        // };
                                        // Utilities.sendEmailTemplate(templateEmailToSend, jwt.createToken(obj), params.email, emailSubject).then((responseSendEmail) => {
                                        //     if (!responseSendEmail) {
                                        //         res.status(500).send({ err: "No se registro el usuario", state: false });
                                        //     } else {
                                        //         res.status(200).send({ data: userSaved, state: true });
                                        //     }
                                        // });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    } else {
        res.status(405).send({ err: "No se guardo un dato" });
    }
};
/* *********** END - Add new user method *********** */
/* ********** START - Send Mail Async method ********** */
const fnSendMailTemplate = (data_obj, email_template, email_subject, email_address, temporal_pass) => {

    return new Promise((resolve, reject) => {
        let obj = {
            '_id': data_obj['_id'],
        };
        Utilities.sendEmailTemplate(email_template, jwt.createToken(obj), email_address, email_subject, temporal_pass).then((responseSendEmail) => {
            if (!responseSendEmail) {
                // res.status(500).send({ err: "No se registro el usuario", state: false });
                reject(new Error("Ocurrio un error!"));
            } else {
                // res.status(200).send({ data: data_obj, state: true });
                resolve({ data: data_obj, state: true });
            }
        });
    });

};
/* *********** END - Send Mail Async method *********** */
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
/* ********** START - Function to return data user by id method ********** */
const fnGetDataUserById = (req, res) => {
    let idUser = req.params["id"];
    console.log('idUser: ', idUser);
    findUserById(idUser).then((dataUser) => {
        console.log('dataUser: ', dataUser);
        if (dataUser) {
            console.log('dataUser: ', dataUser);
            res.status(200).send({ data: dataUser, stateRequest: true });
        } else {
            res.status(401).send({ msg: "No existe el usuario", stateRequest: false });
        }
    }).catch((err) => {
        res.status(500).send({ msg: "Error al conectar al servidor", stateRequest: false });
    });
};
/* *********** END - Function to return data user by id method *********** */
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
/* ********** START - Activate user method ********** */
const activateUser = (req, res) => {
    let tokenUser = req.headers.authorization || '';
    Utilities.fnUserSystemValid(tokenUser).then(resp => {
        User.findByIdAndUpdate(
            { _id: resp['_id'] },
            { userActiveRegister: true }, (err, dataUser) => {
                if (err) {
                    res.status(500).send({ msg: "Error al conectar al servidor", stateRequest: false });
                } else {
                    if (dataUser) {
                        res.status(200).send({ user: dataUser, stateRequest: true });
                    } else {
                        res.status(403).send({ msg: "El usuario no se pudo activar", stateRequest: false });
                    }
                }
            }
        );
    });
    
};
/* *********** END - Activate user method *********** */

module.exports = {
    userSignIn,
    userSignUp,
    userSignUpAuth,
    userList,
    fnGetDataUserById,
    userUpdate,
    deleteUser,
    findUserByEmail,
    findUserByDocumentNumber,
    findUserById,
    activateUser,
};