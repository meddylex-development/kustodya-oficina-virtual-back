// Variable Mongoose
let mongoose = require("mongoose");
// metodo que permite crear esquemas desde node/express
let Schema = mongoose.Schema;

let auditTrackSchema = Schema({
    idUser: { type: Schema.ObjectId, ref: "user" },
    idState: { type: Schema.ObjectId, ref: "state" },
    module: String,
    description: String,
    dateCreated: Number,
    dateUpdated: Number,
});

module.exports = mongoose.model("auditTrack", auditTrackSchema);