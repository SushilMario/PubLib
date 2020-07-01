//Dependencies
var    express = require("express"),
    bodyParser = require("body-parser"),
      mongoose = require("mongoose"),
      passport = require("passport"),
 LocalStrategy = require("passport-local");

//Models
var User = require("./models/user.js"), 
    Book = require("./models/book.js");

//Routes
var authRoutes = require("./routes/index.js");

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

//Use on all routes

app.use
(
    function(req, res, next)
    {
        res.locals.currentUser = req.user;
        next();
    }
)

//The routes

app.use(authRoutes);

app.get("/books", isAdmin,
    function(req, res)
    {
        res.render("book/adminShow");
    }
)

function isAdmin(req, res, next) 
{
    if(req.isAuthenticated())
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
                    if (user.isAdmin) 
                    {
                        return next();
                    }
                }
            }    
        )
    }
    else
    {
        res.redirect("/");
    }
}

//Catch all 

app.get("*",
    function (req, res) 
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

