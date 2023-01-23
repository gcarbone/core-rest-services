require("dotenv").config();

function validate(req, res, next) {
  if (req.headers["api-key"] === process.env.API_KEY) next();
  else res.status(401).send("");

}

module.exports = {
  validate: validate
};
