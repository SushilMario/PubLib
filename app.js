//Dependencies
var    express = require("express"),
    bodyParser = require("body-parser"),
      mongoose = require("mongoose"),
methodOverride = require("method-override"),
      passport = require("passport"),
 LocalStrategy = require("passport-local");

//Models
var User = require("./models/user.js"), 
    Entry = require("./models/entry.js");

//Routes
var authRoutes = require("./routes/index.js"),
    entryRoutes = require("./routes/entry.js");

//Mongoose setup

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
// mongoose.connect("mongodb://localhost/pub-lib");
mongoose.connect("mongodb+srv://sms2001:chemlab@cluster0.9ncvf.mongodb.net/pub-lib?retryWrites=true&w=majority");

//App setup

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

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
app.use("/entries", entryRoutes);

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

