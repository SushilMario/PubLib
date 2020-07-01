var express = require("express"),
   passport = require("passport");

var User = require("../models/user.js");

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
        if (req.body.adminCode !== "" && req.body.adminCode === "1234") 
        {
            newUser.isAdmin = true;
        }

        User.register(newUser, req.body.password,
            function (err, user) 
            {
                if (err) 
                {
                    console.log(err);
                    res.redirect("/register");
                }
                else 
                {
                    passport.authenticate("local")(req, res,
                        function () 
                        {
                            if (user.isAdmin) 
                            {
                                res.redirect("/books");
                            }
                            else 
                            {
                                res.send("Welcome to PubLib, " + user.username + "!");
                            }
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
        failureRedirect: "/login"
    }
), function (req, res) 
   {
       if(req.user && req.user.isAdmin)
       {
           res.redirect("/books");
       }
   }
)

//Logout

router.get("/logout",
    function (req, res) 
    {
        req.logout();
        res.redirect("/");
    }
)

module.exports = router;