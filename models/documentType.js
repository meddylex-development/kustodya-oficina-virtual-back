// Variable Mongoose
let mongoose = require("mongoose");
// metodo que permite crear esquemas desde node/express
let Schema = mongoose.Schema;

let documentTypeSchema = Schema({
    idState: { type: Schema.ObjectId, ref: "state" },
    name: String,
    description: String,
    dateCreated: Number,
    dateUpdated: Number,
});

module.exports = mongoose.model("documentType", documentTypeSchema);