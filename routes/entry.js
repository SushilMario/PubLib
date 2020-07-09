var express = require("express"),
     moment = require("moment");

var User = require("../models/User.js"),
    Entry = require("../models/Entry.js");

var router = express.Router();
    moment().format();

//Index 

router.get("/", isLoggedIn, getOverdue,
    function (req, res) 
    {
        var userId = req.user._id;

        User.findById(userId,
            function(err, user) 
            {
                if(err) 
                {
                    console.log(err);
                    res.redirect("/");
                }
                else 
                {
                    if(user.isAdmin)
                    {
                        Entry.find({},
                            function(err, entries) 
                            {
                                if(err) 
                                {
                                    console.log(err);
                                }
                                else 
                                {
                                    res.render("entry/index", { entries: entries });
                                }
                            }
                        )
                    }
                    else
                    {
                        if(user.entries)
                        {
                            Entry.find().where('_id').in(user.entries).exec((err, entries) => 
                                {
                                    if(err)
                                    {
                                        console.log(err);
                                    }
                                    else
                                    {
                                        res.render("entry/index", { entries: entries });
                                    }
                                }
                            );
                        }
                    }
                }
            }
        )
    }
)

//New

router.get("/new", isAdmin,
    function(req, res)
    {
        res.render("entry/new");
    }
)

//Create 

router.post("/", isAdmin,
    function(req, res)
    {
        var title = req.body.title;
        var author = req.body.author;
        var borrowerUserName = req.body.borrowerUserName;
        var borrowDate = req.body.borrowDate;
        var dueDate = moment(borrowDate).add(2, "weeks");
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
                        var newEntry = { title: title, author: author, borrowDate: borrowDate, dueDate: dueDate, borrower:{id: user._id, username: user.username}};
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
                                    user.entries.push(entry);
                                    User.findByIdAndUpdate(user._id, user,
                                       function(err, updatedUser)
                                       {
                                           if(err)
                                           {
                                               console.log(err);
                                               res.redirect("/entries/new");
                                           }
                                           else
                                           {
                                               res.redirect("/entries"); 
                                           }
                                       } 
                                    )
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

//Edit

router.get("/:id/edit", isAdmin,
    function(req, res)
    {
        Entry.findById(req.params.id,
            function(err, foundEntry)
            {
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    res.render("entry/edit", {entry: foundEntry});
                }
            }
        )
    }
)

//Update

router.put("/:id",
    function(req, res)
    {
        Entry.findById(req.params.id,
            function(err, foundEntry)
            {
                if(err)
                {
                    console.log(err);
                    res.redirect("/entries/" + req.params.id + "/edit");
                }
                else
                {
                    foundEntry.dueDate = req.body.dueDate;
                    Entry.findByIdAndUpdate(req.params.id, foundEntry,
                        function(err, updatedEntry)
                        {
                            if(err)
                            {
                                console.log(err);
                                res.redirect("/entries/" + req.params.id + "/edit");
                            }
                            else
                            {
                                res.redirect("/entries");
                            }
                        }
                    )
                }
            }    
        )
    }
)

//Destroy

router.delete("/:id", isAdmin, 
    function(req, res)
    {
        Entry.findByIdAndRemove(req.params.id,
            function(err)
            {
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    res.redirect("/entries");
                }
            }    
        )
    }
)

//Get overdue

function getOverdue(req, res, next) 
{
    Entry.find({},
        function (err, entries) 
        {
            if (err) 
            {
                console.log(err);
                res.redirect("/");
            }
            else 
            {
                entries.forEach
                (
                    function (entry) 
                    {
                        if (moment().isAfter(entry.dueDate, "day")) 
                        {
                            entry.daysOverdue = moment().diff(entry.dueDate, "day");
                            Entry.findByIdAndUpdate(entry._id, entry,
                                function (err, updatedEntry) 
                                {
                                    if (err) 
                                    {
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

function isLoggedIn(req, res, next) 
{
    if (req.isAuthenticated()) 
    {
        return next();
    }
    else 
    {
        res.redirect("/");
    }
}

function isAdmin(req, res, next) 
{
    if (req.isAuthenticated()) 
    {
        var userId = req.user._id;

        User.findById(userId,
            function(err, user) 
            {
                if(err) 
                {
                    console.log(err);
                    res.redirect("/");
                }
                else 
                {
                    if(user.isAdmin) 
                    {
                        return next();
                    }
                    else
                    {
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

module.exports = router;