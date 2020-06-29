//Dependencies
var    express = require("express"),
    bodyParser = require("body-parser"),
      mongoose = require("mongoose"),
      passport = require("passport"),
 LocalStrategy = require("passport-local");

//Models
var User = require("./models/user.js") 

//Mongoose setup

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/pub-lib");

//App setup

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

//Passport configuration

app.use
(
    require("express-session")
    (
        {
            secret: "Once again Rusty wins cutest dog!",
            resave: false,
            saveUninitialized: false
        }
    )
);

//Passport setup

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/",
    function(req, res)
    {
        res.render("landing");
    }
)

//New 

app.get("/register",
    function(req, res)
    {
        res.render("user/new");
    }
)

//Create 

app.post("/register",
    function(req, res)
    {
        var newUser = new User({ username: req.body.username });

        //Check if the user is registering as an administrator
        if(req.body.adminCode !== "" && req.body.adminCode === "1234")
        {
            newUser.isAdmin = true;
        }

        User.register(newUser, req.body.password,
            function(err, user) 
            {
                if(err) 
                {
                    console.log(err);
                    res.redirect("/register");
                }
                else
                {
                    passport.authenticate("local")(req, res,
                        function() 
                        {
                            res.send("Welcome to PubLib, " + user.username + "!");
                        }
                    )
                }
            }
        )
    }
)

//Login

app.get("/login",
    function(req, res) 
    {
        res.render("user/login");
    }
)

app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/",
        failureRedirect: "/login"
    }
), function(req, res) 
   {}
)



//Catch all 

app.get("*",
    function(req, res)
    {
        res.send("Error 404, page not found");
    }
)

app.listen(3000,
    function() 
    {
        console.log("App up and running!");    
    }
)