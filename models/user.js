// Variable Mongoose
let mongoose = require("mongoose");
// metodo que permite crear esquemas desde node/express
let Schema = mongoose.Schema;

let userSchema = Schema({
    idState: { type: Schema.ObjectId, ref: "state" },
    idProfile: { type: Schema.ObjectId, ref: "profile" },
    firstName: String,
    secondFirstName: String,
    lastName: String,
    secondLastName: String,
    idDocumentType: { type: Schema.ObjectId, ref: "documentType" },
    idCountry: { type: Schema.ObjectId, ref: "country" },
    idCity: { type: Schema.ObjectId, ref: "city" },
    documentNumber: String,
    email: String,
    password: String,
    address: String,
    phoneNumber: String,
    birthDate: Number,
    dateCreated: Number,
    dateUpdated: Number,
});

module.exports = mongoose.model("user", userSchema);