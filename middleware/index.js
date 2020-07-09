var moment = require("moment");

var User = require("../models/User.js"),
    Entry = require("../models/Entry.js");

var middleware = {};

moment().format();

//Generate admin code

middleware.generateCode = function() 
{
    var rand = Math.floor(Math.random() * (9999999 - 1000000 + 1)) + 1000000;
    console.log(rand);
}

//Get overdue

middleware.getOverdue = function(req, res, next) {
    Entry.find({},
        function (err, entries) {
            if (err) {
                console.log(err);
                res.redirect("/");
            }
            else {
                entries.forEach
                    (
                        function (entry) {
                            if (moment().isAfter(entry.dueDate, "day")) {
                                entry.daysOverdue = moment().diff(entry.dueDate, "day");
                                Entry.findByIdAndUpdate(entry._id, entry,
                                    function (err, updatedEntry) {
                                        if (err) {
                                            console.log(err);
                                            res.redirect("/");
                                        }
                                    }
                                )
                            }
                        }
                    )
            }
            return next();
        }
    )
}

//Middleware

middleware.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        req.flash("error", "You must be logged in to do that");
        res.redirect("/login");
    }
}

middleware.isAdmin = function(req, res, next) 
{
    if (req.isAuthenticated()) {
        var userId = req.user._id;

        User.findById(userId,
            function (err, user) {
                if (err) {
                    console.log(err);
                    res.redirect("/");
                }
                else {
                    if (user.isAdmin) {
                        return next();
                    }
                    else {
                        req.flash("error", "You are not authorised to do that");
                        res.redirect("back");
                    }
                }
            }
        )
    }
    else {
        res.redirect("/");
    }
}

module.exports = middleware;