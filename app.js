var express = require("express");
var app = express();

app.get("/",
    function(req, res)
    {
        res.send("HOME PAGE!");
    }
)

app.listen(3000,
    function() 
    {
        console.log("App up and running!");    
    }
)