var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

var User = require("../user/user");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var verifyToken = require("./verifyToken");
var config = require("../config");

router.post('/register', function(req, res) {
    console.log("Coming here");
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);
    User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
    }, function(err, user) {
        if(err) return res.status(500).send("There is a problem registering the user");
        var token = jwt.sign({id: user._id}, config.secret, {expiresIn: 86400});
        res.status(200).send({
            auth:true,
            token,
        });
    });
})

router.get('/me', verifyToken, function(req, res, next) {
    var token = req.headers['x-access-token'];
    // console.log(token, req.headers);
    // res.status(200).send(decoded);
    User.findById(req.userId, {password: 0}, function(err, user) {
        if(err) return res.status(500).send("Problem finding the User");
        if(!user) return res.status(404).send("No user found");
        res.status(200).send(user);
        // next(user)
    })
});

router.use(function(user, req, res, next) {
    res.status(200).send(user);
})
router.post("/login", function(req, res){
    User.findOne({
        email: req.body.email,
    }, function(err, user) {
        console.log(req.body, user);
        if(err) return res.status(500).send("Problem finding the User");
        if(!user) return res.status(404).send("No user found");
        var isPasswordValid = bcrypt.compareSync(req.body.password, user.password);
        if(!isPasswordValid)
            return res.status(401).send({
                auth: false,
                token: null,
            });
        var token = jwt.sign({ id: user._id}, config.secret, { expiresIn: 86400});
        return res.status(200).send({
            auth: true,
            token,
        })
    })
})


router.get("/logout", function(req, res) {
    res.status(200).send({
        auth: false,
        token: null
    })
})
module.exports = router;