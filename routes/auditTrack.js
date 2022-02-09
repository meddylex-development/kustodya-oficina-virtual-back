let express = require("express");
let AuditTrack = require("../controllers/auditTrack");
let api = express.Router();

api.post("/audit-track/add", AuditTrack.addAuditTrack);
api.get("/audit-track/list", AuditTrack.listAuditTrack);
api.post("/audit-track/:description?", AuditTrack.listAuditTrack);
api.put('/audit-track/:id', AuditTrack.updateAuditTrack);
api.delete('/audit-track/:id', AuditTrack.deleteAuditTrack);

module.exports = api;