const express = require('express');
const cors = require('cors');
const PORT = 8080;
const mongoose = require('mongoose');
var databaseURL = "mongodb://localhost:27017/sample_fudo";
const bcrypt = require('bcrypt');
const saltRounds = 12;
var User = require('./user.model');
var dishes = require('./dishes');

//Connect to database
mongoose.connect(databaseURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var app = express();

//Since frontend and backend are running at different ports, use this to fix cors error
app.use(cors());

app.use(express.json());

app.set('port', PORT);
app.use((req, res, next) => {
    next();
});

app.get("/dishes", (req, res) => {
    res.status(200).json({ data: dishes });
});

app.post('/register', (req, res) => {
    let newUser = new User();
    let input = req.body;

    newUser.username = input.username;
    User.findOne({ username: input.username }, function (err, docs) {
        if (err) {
            res.status(500).json({ code: 500, message: "Error Matching Existing User Database", error: err })
        } else {
            if (docs == null) {
                bcrypt.hash(input.password, saltRounds, function (error, hash) {
                    newUser.password = hash;
                    if (error) {
                        res.status(500).json({ code: 500, message: "Error Hashing Password", error: error })
                    } else {
                        newUser.save((errorSave, docs) => {
                            if (errorSave) {
                                res.status(500).json({ code: 500, message: "Error Creating User", error: errorSave })
                            } else {
                                res.status(200).json({ code: 200, message: "User Created Successfully", docs: docs })
                            }
                        })
                    }
                })
            } else {
                res.status(200).json({ code: 500, message: "Username already exists" })
            }
        }
    })
});

app.post('/login', (req, res) => {
    let input = req.body;
    User.findOne({ username: input.username }, function (err, docs) {
        if (err) {
            res.status(500).json({ code: 500, message: "Error Matching Existing User Database", error: err })
        } else {
            if (docs == null) {
                res.status(200).json({ code: 403, message: "Invalid Username", docs: docs })
            } else {
                var passwordValid = bcrypt.compareSync(
                    input.password, docs.password
                );

                if (!passwordValid) {
                    res.status(200).json({ code: 403, message: "Invalid Password", docs: null })
                } else {
                    res.status(200).json({ code: 200, message: "Logged in Successfully", docs: docs })
                }
            }
        }
    })
});

app.use('*', function (req, res) {
    res.status(200).json({ code: 404, message: "Endpoint does not exist!" });
});

app.listen(PORT, console.log(`Server running in port: ${PORT}`));