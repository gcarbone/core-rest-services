require("dotenv").config();

function validate(req, res, next) {
  next();
}

module.exports = {
  validate: validate
};
