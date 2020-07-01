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
        }
        // books:
        // [
        //     {
        //         type: mongoose.Schema.Types.ObjectId,
        //         ref: "Book"
        //     }
        // ]
    }
);

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
