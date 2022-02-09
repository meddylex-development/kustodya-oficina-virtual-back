let express = require("express");
let bodyParser = require("body-parser");
let mongoose = require("mongoose");

let port = process.env.PORT || 3001;

let app = express();

let User = require("./routes/user");
let State = require("./routes/state");
let Profile = require("./routes/profile");
let DocumentType = require("./routes/documentType");
let Menu = require("./routes/menu");
let Country = require("./routes/country");
let City = require("./routes/city");
let MenuProfile = require("./routes/menuProfile");
let AuditTrack = require("./routes/auditTrack");

app.listen(port, () => {
});

mongoose.connect("mongodb://localhost:27017/stemcelldb", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
})
.then(() => {
})
.catch((err) => {
});

// Analizar la codificacion de las url
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Content-Type: application/json");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  res.header("Allow", "GET, PUT, POST, DELETE, OPTIONS");
  next();
});

app.use("/api", User);
app.use("/api", State);
app.use("/api", Profile);
app.use("/api", DocumentType);
app.use("/api", Menu);
app.use("/api", Country);
app.use("/api", City);
app.use("/api", MenuProfile);
app.use("/api", AuditTrack);
module.exports = app;