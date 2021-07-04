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

middleware.compareValues = function(key, order = 'asc') 
{
    return function innerSort(a, b) 
    {
        const varA = (typeof a[key] === 'string')
        ? a[key].toUpperCase() : a[key];
        const varB = (typeof b[key] === 'string')
        ? b[key].toUpperCase() : b[key];

        let comparison = 0;
        if (varA > varB)
        {
            comparison = 1;
        } 
        else if (varA < varB) 
        {
            comparison = -1;
        }
        return (
            (order === 'desc') ? (comparison * -1) : comparison
        );
    };
}

middleware.search = function(entries, queryWords)
{
    let titleWords = [], authorNames = [];
    const results = [];
    let hits = 0;

    for(let entry in entries)
    {
        titleWords = entry.title.split(" ");
        authorNames = entry.author.split(" ");
        for(let queryWord of queryWords)
        {
            for(let titleWord of titleWords)
            {
                if(queryWord === titleWord)
                {
                    hits += 2;
                }
            }
            for(let authorName of authorNames)
            {
                if(queryWord === authorName)
                {
                    hits += 1;
                }
            }
        }
        if(hits > 0)
        {
            results.push(entry);
        }
        hits = 0;
    }
    return results;
}

module.exports = middleware;