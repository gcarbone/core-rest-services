require("dotenv").config();
const router = require("express").Router();
const { exec } = require("child_process");

router.post("/exec", function (req, res, next) {
  const wait = req.body.wait === undefined ? true : req.body.wait; 
  
  const options = {
    cwd: req.body.cwd,
  };
  if (!wait) {
    res.status(202).send("");
    next();
  };
  exec(req.body.command, options, (error, stdout, stderr) => {
    if (wait)
      res.json({
        stdout: stdout,
        stderr: stderr,
        error: error,
      });
      next();
  });
});

module.exports = router;
