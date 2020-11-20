const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    mongoose = require("mongoose"),
    port = 2000,
    path = require("path"),
    routes = require("./routes.js")
cors = require('cors')

/* ---Database Connection--- */
mongoose.connect("mongodb+srv://atanao:dontinon@cluster0.enweg.mongodb.net/TaxiAppDB?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
},
    function (err, database) {
        if (err) {
            throw err
        }
        console.log("Connection made to Database")
    }
)
mongoose.set('useCreateIndex', true)

/* ---Middleware--- */
app.set("views", path.join(__dirname, "views"))
// app.set("view engine","ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(cors())

/* ---Import Routes ---*/
app.use(routes)

/* ---Calling the port the server in running on---*/
app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`)
})