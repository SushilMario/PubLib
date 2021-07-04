         var mongoose = require("mongoose"),
passportLocalMongoose = require("passport-local-mongoose");
const passport = require("passport");

var UserSchema = new mongoose.Schema
(
    {
        username: String,
        password: String,
        isAdmin:
        {
            type: Boolean,
            default: false
        },
        entries:
        [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Entry"
            }
        ],
        previousBorrows:
        [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Entry"
            }
        ]
    }
);

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
