var mongoose = require("mongoose");

var BookSchema = new mongoose.Schema
    (
        {
            title: String,
            author: String,
            borrowDate: String,
            dueDate: String,
            borrower:
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        }
    );

module.exports = mongoose.model("Book", BookSchema);