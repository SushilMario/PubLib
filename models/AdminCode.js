var mongoose = require("mongoose");

var CodeSchema = new mongoose.Schema
    (
        {
            code: String
        }
    );

module.exports = mongoose.model("Code", CodeSchema);