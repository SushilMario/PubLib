var express = require("express"),
   passport = require("passport");

var User = require("../models/User.js");

var router = express.Router();

//Home 

router.get("/",
    function (req, res) 
    {
        res.render("landing");
    }
)

//New 

router.get("/register",
    function (req, res) 
    {
        res.render("user/new");
    }
)

//Create 

router.post("/register",
    function (req, res) {
        var newUser = new User({ username: req.body.username });

        //Check if the user is registering as an administrator
        if (req.body.adminCode !== "" && req.body.adminCode === "6918899") 
        {
            newUser.isAdmin = true;
        }

        User.register(newUser, req.body.password,
            function (err, user) 
            {
                if (err) 
                {
                    req.flash("error", "A user with the given username already exists");
                    res.redirect("/register");
                }
                else 
                {
                    passport.authenticate("local")(req, res,
                        function() 
                        {
                            req.flash("success", "Welcome to Publib, " + user.username + "!");
                            res.redirect("/entries");
                        }
                    )
                }
            }
        )
    }
)

//Login

//Form 

router.get("/login",
    function (req, res) 
    {
        res.render("user/login");
    }
)

//Authenticate

router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/entries",
        failureRedirect: "/login"
    }
), function (req, res) 
   {}
)

//Logout

router.get("/logout",
    function (req, res) 
    {
        req.logout();
        req.flash("success", "Successfully logged you out!");
        res.redirect("/");
    }
)

module.exports = router;