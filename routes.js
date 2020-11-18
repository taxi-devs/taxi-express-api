const express        = require('express'),
      router         = express.Router(),
      passport       = require("passport"),
      LocalStrategy  = require("passport-local"),
      User           = require("./models/userSchema.js"),
      bookSchema     = require("./models/bookSchema.js"),
      rideSchema     = require("./models/rideSchema.js"),
      carSchema      = require("./models/carSchema.js"),
      driverSchema   = require("./models/driverSchema.js")

      router.use(require("express-session")({
        secret:"Any normal Word",       /* ---decode or encode session--- */
        resave: false,          
        saveUninitialized:false    
    }))
    
    /* ---Users--- */
    passport.serializeUser(User.serializeUser())       /* ---session encoding--- */
    passport.deserializeUser(User.deserializeUser())   /* ---session decoding--- */
    passport.use(new LocalStrategy(User.authenticate()))
    router.use(passport.initialize())
    router.use(passport.session())


/* ---User Sign up route--- */
router.get('/', (req,res) =>{
    res.render("SignUp")
})


/* ---Create new record for new user--- */
router.post("/sign-up",(req,res)=>{
    
    User.register(new User({
            fullName: req.body.fullName,
            email: req.body.email,
            username: req.body.username,
            password:req.body.password
            }), req.body.password,function(err,user){
                if(err){
                    console.log(err)
                    res.render("SignUp")
                }
                passport.authenticate("local")(req,res,function(){
                res.redirect("/login")
                })    
    })
})


/* ---User Login route--- */
router.get("/login",(req,res)=>{
    res.render("login")
})


/* ---User Authentication--- */
router.post("/login",passport.authenticate("local",{
    successRedirect:"/book",
    failureRedirect:"/login"
}),function (req, res){

})

function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
}

router.get("/book",isLoggedIn ,(req,res) =>{
    carSchema.find({},(err,cars)=>{
        if (err) {console.log(err);
        }else{
            res.render("bookingForm",{cars: cars});
        }
    })
})

/* ---Add a new user's booking record to the database--- */
router.post("/add-booking", function(req,res){
    var passenger_name = req.body.passenger_name;
    var pickup_location = req.body.pickup_location;
    var dropoff_location = req.body.dropoff_location;
    var pickup_time = req.body.pickup_time;
    var dropoff_time = req.body.dropoff_time;
    var date = req.body.date;
    var car = req.body.car;
    var number_of_passengers = req.body.number_of_passengers;
    var newBooking = {passenger_name:passenger_name, pickup_location:pickup_location, dropoff_location:dropoff_location, pickup_time:pickup_time, dropoff_time:dropoff_time, date:date, car:car, number_of_passengers:number_of_passengers};
    bookSchema.create(newBooking,(err,data)=>{
        if(err){
            console.log(err);
        }else {
            console.log(data);
            //res.redirect("/view-booking");
            res.send(`  <html>
                        <body>
                        <div>
                            <h2>BOOKING INFORMATION</h2>
                            <p>===================================</p>
                            <p>Passenger Name-------------: ${data.passenger_name}</p>
                            <p>Pick-up Location-----------: ${data.pickup_location}</p>
                            <p>Drop-off Location----------: ${data.dropoff_location}</p>
                            <p>Pick-up Time---------------: ${data.pickup_time}</p>
                            <p>Drop-off Time--------------: ${data.dropoff_time}</p>
                            <p>Date-----------------------: ${data.date}</p>
                            <p>Car------------------------: ${data.car}</p>
                            <p>Number of Passengers-------: ${data.number_of_passengers}</p>
                            <p>===================================</p>
                        </div>
                        <div>
                            <button><a href="/"> Log Out </a></button>
                        </div>
                        </body>
                        </html> `)
        }
    })
})


//=========================== Admin Section ===============
//=========================== Rides Section ===============
/* ---Add a new rides record to the database--- */
router.post("/add-ride", function(req,res){
    var pickup_location = req.body.pickup_location;
    var dropoff_location = req.body.dropoff_location;
    var newRide = {pickup_location:pickup_location, dropoff_location:dropoff_location};
    rideSchema.create(newRide,(err,data)=>{
        if(err){
            console.log(err);
        }else {
            console.log(data);
            res.redirect("/ride")
        }
    })
})

/* Retrieve Rides records */
router.get("/ride", (req,res) =>{
    rideSchema.find({},(err,locations)=>{
        if (err) {console.log(err);
        }else{
            res.render("rideForm",{locations: locations});
        }
    })
})

/* Delete Rides records */
router.delete("/delete-ride-record:id",(req,res)=>{
    rideSchema.findByIdAndRemove(req.params.id,function (err){
        if(err){
            console.log(err);
            res.redirect("/ride");
        }else {
            res.redirect("/ride");
            }
    })
})

/* Update Rides records */
//Get EditForm
router.get("/update-ride-record:id/edit",(req,res)=>{
    rideSchema.findById(req.params.id,function (err, ride){
        if(err){
            console.log(err);
            res.redirect("/ride");
        }else{
            res.render("editRideForm",{ride: ride});
        }
    })
})

//Edit Put request
router.put("/update-ride-record:id/edit",(req, res)=>{
    rideSchema.findByIdAndUpdate(req.params.id,req.body.ride,function(err,updatedata){
        if(err){
            console.log(err);
        }else{
            console.log(updatedata)
            res.redirect("/ride");
        }
    })
})

//=========================== Cars Section ===============
/* ---Add a new car record to the database--- */
router.post("/add-car", function(req,res){
    var carType = req.body.carType;
    var plateNo = req.body.plateNo;
    var newCar = {carType:carType, plateNo:plateNo};
    carSchema.create(newCar,(err,data)=>{
        if(err){
            console.log(err);
        }else {
            console.log(data);
            res.redirect("/car")
        }
    })
})

/* Retrieve Car records */
router.get("/car", (req,res) =>{
    carSchema.find({},(err,cars)=>{
        if (err) {console.log(err);
        }else{
            res.render("carForm",{cars: cars});
        }
    })
})

/* Delete Car records */
router.delete("/delete-car-record:id",(req,res)=>{
    carSchema.findByIdAndRemove(req.params.id,function (err){
        if(err){
            console.log(err);
            res.redirect("/car");
        }else {
            res.redirect("/car");
            }
    })
})

/* Update Cars records */
//Get EditForm
router.get("/update-car-record:id/edit",(req,res)=>{
    carSchema.findById(req.params.id,function (err, car){
        if(err){
            console.log(err);
            res.redirect("/car");
        }else{
            res.render("editCarForm",{car: car});
        }
    })
})

//Edit Put request
router.put("/update-car-record:id/edit",(req, res)=>{
    carSchema.findByIdAndUpdate(req.params.id,req.body.car,function(err,updatedata){
        if(err){
            console.log(err);
        }else{
            console.log(updatedata)
            res.redirect("/car");
        }
    })
})

//=========================== Drivers Section ===============
/* ---Add a new driver record to the database--- */
router.post("/add-driver", function(req,res){
    var name = req.body.name;
    var age = req.body.age;
    var phone = req.body.phone
    var newDriver = {name:name, age:age, phone:phone};
    driverSchema.create(newDriver,(err,data)=>{
        if(err){
            console.log(err);
        }else {
            console.log(data);
            res.redirect("/driver")
        }
    })
})

/* Retrieve Drivers records */
router.get("/driver", (req,res) =>{
    driverSchema.find({},(err,drivers)=>{
        if (err) {console.log(err);
        }else{
            res.render("driverForm",{drivers: drivers});
        }
    })
})

/* Delete Drivers records */
router.delete("/delete-driver-record:id",(req,res)=>{
    driverSchema.findByIdAndRemove(req.params.id,function (err){
        if(err){
            console.log(err);
            res.redirect("/driver");
        }else {
            res.redirect("/driver");
            }
    })
})

/* Update Drivers records */
//Get EditForm
router.get("/update-driver-record:id/edit",(req,res)=>{
    driverSchema.findById(req.params.id,function (err, driver){
        if(err){
            console.log(err);
            res.redirect("/driver");
        }else{
            res.render("editDriverForm",{driver: driver});
        }
    })
})

//Edit Put request
router.put("/update-driver-record:id/edit",(req, res)=>{
    driverSchema.findByIdAndUpdate(req.params.id,req.body.driver,function(err,updatedata){
        if(err){
            console.log(err);
        }else{
            console.log(updatedata)
            res.redirect("/driver");
        }
    })
})


//=========================== Users Section ===============
/* ---Add a new user record to the database--- */
router.post("/add-new-user",(req,res)=>{
    
    User.register(new User({
            fullName: req.body.fullName,
            email: req.body.email,
            username: req.body.username,
            password:req.body.password
            }), req.body.password,function(err,user){
                    if(err){
                        console.log(err)
                        res.render("SignUp")
                    }
                    passport.authenticate("local")(req,res,function(){
                    res.redirect("/view-user")
                })    
    })
})

/* Retrieve Users records */
router.get("/view-user", (req,res) =>{
    User.find({},(err,users)=>{
        if (err) {console.log(err);
        }else{
            res.render("viewUser",{users: users});
        }
    })
})

/* Delete Users records */
router.delete("/delete-user-record:id",(req,res)=>{
    User.findByIdAndRemove(req.params.id,function (err){
        if(err){
            console.log(err);
            res.redirect("/view-user");
        }else {
            res.redirect("/view-user");
            }
    })
})

/* Update Users records */
//Get EditForm
router.get("/update-user-record:id/edit",(req,res)=>{
    User.findById(req.params.id,function (err, user){
        if(err){
            console.log(err);
            res.redirect("/view-user");
        }else{
            res.render("editUserForm",{user: user});
        }
    })
})

//Edit Put request
router.put("/update-user-record:id/edit",(req, res)=>{
    User.findByIdAndUpdate(req.params.id,req.body.user,function(err,updatedata){
        if(err){
            console.log(err);
        }else{
            console.log(updatedata)
            res.redirect("/view-user");
        }
    })
})

//=========================== Bookings Section ===============
/* ---Route to admin booking--- */
router.get("/admin-add-booking", (req,res) =>{
    carSchema.find({},(err,cars)=>{
        if (err) {console.log(err);
        }else{
            res.render("adminBookForm",{cars: cars});
        }
    })
})

/* ---Add a new user's booking record to the database--- */
router.post("/admin-add-booking", function(req,res){
    var passenger_name = req.body.passenger_name;
    var pickup_location = req.body.pickup_location;
    var dropoff_location = req.body.dropoff_location;
    var pickup_time = req.body.pickup_time;
    var dropoff_time = req.body.dropoff_time;
    var date = req.body.date;
    var car = req.body.car;
    var number_of_passengers = req.body.number_of_passengers;
    var newBooking = {passenger_name:passenger_name, pickup_location:pickup_location, dropoff_location:dropoff_location, pickup_time:pickup_time, dropoff_time:dropoff_time, date:date, car:car, number_of_passengers:number_of_passengers};
    bookSchema.create(newBooking,(err,data)=>{
        if(err){
            console.log(err);
        }else {
            console.log(data);
            res.redirect("/view-all-booking");
        }
    })
})


/* ---Route to view all booking details--- */
router.get("/view-all-booking", function(req,res){
    bookSchema.find({},(err,bookings)=>{
        if (err) {console.log(err);
        }else{
            res.render("viewAllBookings",{bookings: bookings});
        }
    })
})

/* Delete Booking records */
router.delete("/delete-booking-record:id",(req,res)=>{
    bookSchema.findByIdAndRemove(req.params.id,function (err){
        if(err){
            console.log(err);
            res.redirect("/view-all-booking");
        }else {
            res.redirect("/view-all-booking");
            }
    })
})

/* Update Booking records */
//Get EditForm
router.get("/update-booking-record:id/edit",(req,res)=>{
    bookSchema.findById(req.params.id,function (err, booking){
        if(err){
            console.log(err);
            res.redirect("/view-all-booking");
        }else{
            res.render("adminEditBookingForm",{booking: booking});
        }
    })
})

//Edit Put request
router.put("/update-booking-record:id/edit",(req, res)=>{
    bookSchema.findByIdAndUpdate(req.params.id,req.body.booking,function(err,updatedata){
        if(err){
            console.log(err);
        }else{
            console.log(updatedata)
            res.redirect("/view-all-booking");
        }
    })
})
module.exports = router