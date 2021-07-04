var mongoose = require("mongoose");

var EntrySchema = new mongoose.Schema
    (
        {
            title: String,
            author: String,
            borrowDate: Date,
            dueDate: Date,
            returnDate: Date,
            daysOverdue: 
            {
                type: Number,
                default: 0
            },
            borrower:
            {
                id:
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                },
                username: String
            },
            isDue: 
            {
                type: Boolean,
                default: true
            }
        }
    );

module.exports = mongoose.model("Entry", EntrySchema);