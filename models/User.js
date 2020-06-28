var mongoose = require("mongoose");

var BookSchema = new mongoose.Schema
    (
        {
            username: String,
            password: String,
            isAdmin:
            {
                type: Boolean,
                default: false
            },
            books:
            [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Book"
                }
            ]
        }
    );

module.exports = mongoose.model("User", userSchema);
