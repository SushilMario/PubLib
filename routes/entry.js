var express = require("express");

var User = require("../models/user.js"),
    Entry = require("../models/entry.js");

var router = express.Router();

//Index 

router.get("/", isAdmin,
    function (req, res) 
    {
        res.render("entry/adminShow");
    }
)

//New

router.get("/new", isAdmin,
    function(req, res)
    {
        res.render("entry/new");
    }
)

//Create route

router.post("/", isAdmin,
    function(req, res)
    {
        var title = req.body.title;
        var author = req.body.author;
        var borrowerUserName = req.body.borrowerUserName;
        User.findOne({username: borrowerUserName}, 
            function(err, user)    
            {
                if(err)
                {
                    console.log(err);
                    res.redirect("/entries/new");
                }
                else
                {
                    if(user)
                    {
                        var newEntry = { title: title, author: author, borrower:{id: user._id, username: user.username}};
                        Entry.create(newEntry, 
                            function(err, entry)
                            {
                                if(err)
                                {
                                    console.log(err);
                                    res.redirect("/entries/new");
                                }
                                else
                                {
                                    console.log(entry.borrower);
                                    res.redirect("/entries");
                                }
                            }    
                        )
                    }
                    else
                    {
                        console.log("User not found");
                        res.redirect("/entries/new");
                    }
                }
            }
        )
    }
)

//Middleware

function isAdmin(req, res, next) {
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
                }
            }
        )
    }
    else {
        res.redirect("/");
    }
}

module.exports = router;