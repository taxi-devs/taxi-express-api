const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    mongoose = require("mongoose"),
    host = process.env.HOST || 'http://localhost'
    port = process.env.PORT || 2000,
    path = require("path"),
    routes = require("./routes.js")
    cors = require('cors')
    dotenv = require('dotenv')
    
/* ---Middleware--- */
app.set("views", path.join(__dirname, "views"))
// app.set("view engine","ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(cors())
app.use(express.json())
dotenv.config();

/* ---Database Connection--- */
const dburi = process.env.MONGOURI;
mongoose.connect(dburi, {
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
mongoose.set('useFindAndModify', false);


/* ---Import Routes ---*/
app.use(routes)

/* ---Calling the port the server in running on---*/
app.listen(port, () => {
    console.log(`App running on ${host}:${port}`)
})