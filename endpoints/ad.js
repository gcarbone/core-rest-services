require("dotenv").config();
const router = require("express").Router();
const ad = require('ad');
let connection = new ad({
    url: process.env.AD_URL,
    user: process.env.AD_PRINCIPAL,
    pass: process.env.AD_CREDENTIALS
});
/*
router.use((req,res,next) =>{
    console.log(req.body);
    next();
});
*/

router.get("/user", function (req, res, next) {
    const fields = req.query.fields.split(',');
    //const filter = JSON.parse(req.query.filter) || {};
    console.log(fields);
    connection.user().get({fields}).then(users => {
        console.log('Your users:', users);
        res.json(users);
        next();
    }).catch(err => {
        console.log('Error getting users:', err);
        next(err);
    });
  
});
router.get("/user/:userName", function (req, res, next) {
    const filter = req.query.filter || '';
    console.log(req.params.userName);
    connection.user(req.params.userName).get(filter).then(user => {
        console.log(user);
        res.json(user);
        next();
    }).catch(err => {
        console.log('Error getting users:', err);
        next(err);
    });
  
});

router.get("/user/:userName/memberOf/:group", function (req, res, next) {
    console.log(req.params.userName);
    connection.user(req.params.userName).isMemberOf(req.params.group).then(response => {
        console.log(response);
        res.json({
            isMember: response
        });
        next();
    }).catch(err => {
        console.log('Error:', err);
        next(err);
    });
  
});

router.get("/user/:userName/exists", function (req, res, next) {
    console.log(req.params.userName);
    connection.user(req.params.userName).exists().then(response => {
        console.log(response);
        res.json({
            exists: response
        });
        next();
    }).catch(err => {
        console.log('Error:', err);
        next(err);
    });
  
});

router.put("/user/:userName/enable", function (req, res, next) {
    console.log(req.params.userName);
    connection.user(req.params.userName).enable().then(response => {
        console.log(response);
        res.json(response);
        next();
    }).catch(err => {
        console.log('Error:', err);
        next(err);
    });
  
});

router.put("/user/:userName/unlock", function (req, res, next) {
    console.log(req.params.userName);
    connection.user(req.params.userName).unlock().then(response => {
        console.log(response);
        res.json(response);
        next();
    }).catch(err => {
        console.log('Error:', err);
        res.status(404).json(err)
        next(err);
    });
  
});

router.put("/user/:userName/disable", function (req, res, next) {
    console.log(req.params.userName);
    connection.user(req.params.userName).disable().then(response => {
        console.log(response);
        res.json(response);
        next();
    }).catch(err => {
        console.log('Error:', err);
        next(err);
    });
  
});

router.delete("/user/:userName", function (req, res, next) {
    console.log(req.params);
    connection.user(req.params.userName).remove().then(response => {
        console.log(response);
        res.json(response);
        next();
    }).catch(err => {
        console.log('Error:', err);
        res.status(500).json(err);
        next(err);
    });
  
});

router.put("/user/:userName/group/:groupName", function (req, res, next) {
    connection.group(req.params.groupName).addUser(req.params.userName).then(response => {
        console.log(response);
        res.json(response);
        next();
    }).catch(err => {
        console.log('Error:', err);
        res.status(500).json(err);
        next(err);
    });
  
});

router.delete("/user/:userName/group/:groupName", function (req, res, next) {
    connection.group(req.params.groupName).removeUser(req.params.userName).then(response => {
        console.log(response);
        res.json(response);
        next();
    }).catch(err => {
        console.log('Error:', err);
        res.status(500).json(err);
        next(err);
    });
  
});

router.post("/user", function (req, res, next) {
    console.log(req.body);
    connection.user().add({
        userName:req.body.userName,
        password:req.body.password,
        commonName:req.body.commonName,
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        email:req.body.email,
        title:req.body.title,
        location:req.body.location
    }).then(response => {
        console.log(response);
        res.json(response);
        next();
    }).catch(err => {
        console.log('Error creating user:', err);
        res.status(500).json(err);
        next(err);
    });
  
});

async function reconnect(){
    let connection = new ad({
        url: process.env.AD_URL,
        user: process.env.AD_PRINCIPAL,
        pass: process.env.AD_CREDENTIALS
    });  
}

module.exports = router;
