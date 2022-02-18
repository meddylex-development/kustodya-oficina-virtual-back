let jwt = require("jwt-simple");
let moment = require("moment");
let secret = "BaseParkway-StemCell-2021*.";

exports.createToken = (user) => {
    let payload = {
        _id: user._id,
        // idState: user.idState,
        // idProfile: user.idProfile,
        // firstName: user.firstName,
        // secondFirstName: user.secondFirstName,
        // lastName: user.lastName,
        // secondLastName: user.secondLastName,
        // idDocumentType: user.idDocumentType,
        // idCountry: user.idCountry,
        // idCity: user.idCity,
        // documentNumber: user.documentNumber,
        // email: user.email,
        // address: user.address,
        // phoneNumber: user.phoneNumber,
        // birthDate: user.birthDate,
        dateExp: moment(moment().add(1, 'day')).valueOf(),
        iat: moment().unix(),
    };
    return jwt.encode(payload, secret);
};

exports.decodeToken = (token) => {
    return jwt.decode(token, secret);
};