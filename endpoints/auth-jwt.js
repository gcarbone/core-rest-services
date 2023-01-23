require("dotenv").config();
const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const users = [];


router.post("/createUser", async function (req, res, next) {
    if (!req.body.name || !req.body.password) {
        res.status(400).send();
      } else {
        const user = req.body.name;
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        users.push({ user: user, password: hashedPassword });
        res.status(201).send(users);
        console.log(users);
      }
      next();
  });

  router.post("/login", async function (req, res, next) {
    const user = users.find((c) => c.user == req.body.name);
    //check to see if the user exists in the list of registered users
    if (user == null) res.status(404).send("User does not exist!");
    //if user does not exist, send a 400 response
    if (await bcrypt.compare(req.body.password, user.password)) {
      const accessToken = generateAccessToken({ user: req.body.name });
      const refreshToken = generateRefreshToken({ user: req.body.name });
      let response = { accessToken: accessToken, refreshToken: refreshToken };
      console.log(response);
      res.json(response);
    } else {
      res.status(401).send("Password Incorrect!");
    }
    next();
  });

  router.get("/validate", function (req, res, next) {
    validate(req, res, next);
    next();
  });

  router.get("/refreshToken", function (req, res, next) {
    if (!refreshTokens.includes(req.body.token)) {
        res.status(400).send("Refresh Token Invalid");
      } else {
        refreshTokens = refreshTokens.filter((c) => c != req.body.token);
        //remove the old refreshToken from the refreshTokens list
        const accessToken = generateAccessToken({ user: req.body.name });
        const refreshToken = generateRefreshToken({ user: req.body.name });
        //generate new accessToken and refreshTokens
        res.json({ accessToken: accessToken, refreshToken: refreshToken });
      }
      next();
  });

  router.get("/logout", function (req, res, next) {
    refreshTokens = refreshTokens.filter((c) => c != req.body.token);
    //remove the old refreshToken from the refreshTokens list
    res.status(204).send("Logged out!");
    next();
  });

  function validate(req,res,next){
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader.split(" ")[1];
        //the request header contains the token "Bearer <token>", split the string and use the second value in the split array.
        if (token == null) res.sendStatus(400).send("Token not present");
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
          if (err) {
            res.status(403).send("Token invalid");
          } else {
            req.user = user;
            next(); //proceed to the next action in the calling function
          }
        }); //end of jwt.verify()
      } catch {
        res.status(401).send('');
      }
}



// accessTokens
function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
}

// refreshTokens
let refreshTokens = [];
function generateRefreshToken(user) {
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "20m",
  });
  refreshTokens.push(refreshToken);
  return refreshToken;
}
module.exports = {
    router: router,
    validate: validate
};
