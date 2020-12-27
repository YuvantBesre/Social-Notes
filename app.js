require('dotenv').config();
const Express = require("express");
const bodyParser = require("body-parser");
const EJS = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const { response } = require('express');

const app = Express();
app.set('view engine', 'EJS');

//MIDDLEWARES
app.use(Express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(Express.static("public"));

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//SETTING UP MONGOOSE PACKAGE FOR DATABASE CONVERSATION
mongoose.connect("mongodb+srv://yuvant_123:Kriti1990@cluster0.ligcs.mongodb.net/NotesDB", { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set("useCreateIndex", true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);

// CREATING DATABASE SCHEMA
const note = {
    title: "",
    content: "",
    access : Boolean,
    creator : ""
}
const userSchema = new mongoose.Schema({
    name: String,
    mobileNumber: Number,
    password: String,
    notes: [note]
});

userSchema.plugin(passportLocalMongoose);

// CREATING MODEL FOR THE ABOVE SCHEMA
const user = mongoose.model("User", userSchema);

passport.use(user.createStrategy());

passport.serializeUser(function (User, done) {
    done(null, User.id);
});

passport.deserializeUser(function (id, done) {
    user.findById(id, function (err, User) {
        done(err, User);
    });
});

// ------------------------------------ GET REQUESTS ----------------------------------------
app.get("/", function (request, response) {
    response.render("landing");
});
app.get("/register", function (request, response) {
    response.redirect("/");
});
app.get("/login", function (request, response) {
    response.redirect("/");
});
app.get("/home", function (request, response) {

    if (request.isAuthenticated()) {

        const currentUser = request.user;

        user.findOne({ username: currentUser.username }, function (err, foundUser) {
            if (err) {
                console.log(err);
            }
            else {
                response.render("index" , {Name : foundUser.name, Notes : foundUser.notes});
            }
        });
    }
    else {
        response.redirect("/");
    }

});

app.get("/logout", function (request, response) {
    request.logOut();
    response.redirect("/");
});

app.get("/edit/:postID" , function(request , response){
    const URL = request.params.postID;
    const currentUser = request.user;

    if(request.isAuthenticated()){

        user.findOne({username : currentUser.username } , {notes : {$elemMatch : {_id : URL}}} , function(err , foundPost){
            if(err)
            {
                console.log(err);
            }
            else
            {
                response.render("edit" , {Notes : foundPost.notes});
            }
        });
    }
    else
    {
        response.redirect("/");
    }

});


// ------------------------------------ POST REQUESTS ----------------------------------------

app.post("/register", function (request, response) {

    user.register({ username: request.body.username, name: request.body.name1 }, request.body.password, function (err, result) {

        if (err) {
            console.log(err);
            response.redirect("/");
        }
        else {
            passport.authenticate("local")(request, response, function () {
                response.redirect("/home");
            });
        }
    });
});

app.post("/login", function (request, response) {


    const newUser = new user({

        mobileNumber: request.body.username,
        password: request.body.password
    });

    request.logIn(newUser, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            passport.authenticate("local")(request, response, function () {
                response.redirect("/home");
            });
        }
    });
});

//ROUTE TO ADD NOTES
app.post("/notes", function (request, response) {

    if (request.isAuthenticated()) {
        const currentUser = request.user;

        note.title = request.body.title;
        note.content = request.body.content;
        note.access = true;
        note.creator = currentUser.name;
        

        user.findOneAndUpdate({ username: currentUser.username }, { $push: { notes: note } }, function (err, found) {
            if (err) {
                console.log(err);
            }
        });

        user.findOne({ username: currentUser.username }, function (err, foundUser) {
            if (err) {
                console.log(err);
            }
            else
            {
                response.redirect("/home");
            }
        });

    }
    else
    {
        response.redirect("/");
    }
});

// ROUTE TO DELETE ANY NOTE
app.post("/delete/:postID" , function(request , response){

    const URL = request.params.postID;

    if(request.isAuthenticated()){

        user.findOneAndUpdate({username : request.user.username} , {$pull : { "notes" : { _id : URL}}} , function(err , result){
            if(err)
            {
                console.log(err);
            }
            else
            {
                response.redirect("/home");
            }
        });

    } 
    else
        {
            response.redirect("/home");
        } 
});

// ROUTE FOR SHARING ANY NOTE TO OTHER USERS
app.post("/shared/:postID" , function(request , response){

    const URL = request.params.postID;
    const currentUser = request.user;
    const readOnly = request.body.read;

    if(request.isAuthenticated())
    {
        user.findOne({username : currentUser.username } , {notes : {$elemMatch : {_id : URL}}} , function(err , foundPost){
            if(err)
            {
                console.log(err);
            }
            else
            {
                if(readOnly === "on")
                {
                    foundPost.notes[0].access = false;
                }
                user.findOneAndUpdate({ username : request.body.username} , {$push : { notes : foundPost.notes }} , function(err , result){

                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        response.redirect("/home");
                    }
                   });
               
            }
        });
    }
});

//ROUTE FOR RENDERING THE SEARCHED USER
app.post("/search" , function(request , response){
      
    const userName = request.body.searched;
    const currentUser = request.user.name;

    user.findOne({ username : userName } , function(err , foundUser){

        if(err)
        {
            console.log(err);
        }
        else
        {
            response.render("searched" , { Name : currentUser , searchedUser : foundUser.name , Notes : foundUser.notes , value : userName});
        }
    });
});

//ROUTE FOR EDITING ANY NOTE
app.post("/edit/:postID" , function(request , response){

    if(request.isAuthenticated())
    {
        const currentUser = request.user;
        const URL = request.params.postID;

        note.title = request.body.title;
        note.content = request.body.content;

        user.findOne({ username : currentUser.username } , {notes : {$elemMatch : {_id : URL}}} , function(err , foundPost){

            if(err)
            {
                console.log(err);
            }
            else
            {
                foundPost.notes[0].update = note.title;
                foundPost.notes[0].content = note.content;
                foundPost.save();

                response.redirect("/home");
            }
        });

    }
    else
    {
        response.redirect("/");
    }


});

// LISTENING ON THE GIVEN PORT

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function () {
    console.log("Server is running...");
});
