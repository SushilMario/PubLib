var mongoose = require("mongoose");

var EntrySchema = new mongoose.Schema
    (
        {
            title: String,
            author: String,
            borrowDate: Date,
            dueDate: Date,
            borrower:
            {
                id:
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                },
                username: String
            }
        }
    );

module.exports = mongoose.model("Entry", EntrySchema);