var express = require("express"),
     moment = require("moment");

var User = require("../models/user.js"),
    Entry = require("../models/entry.js");

var router = express.Router();
    moment().format();

//Index 

router.get("/", isLoggedIn,
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
                                    res.render("entry/show", { entries: entries });
                                }
                            }
                        )
                    }
                    else
                    {
                        var entries = [];
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
                                        console.log(entries);
                                        res.render("entry/show", { entries: entries });
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
        // var momentBorrowDate = moment(borrowDate);
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
                }
            }
        )
    }
    else {
        res.redirect("/");
    }
}

module.exports = router;