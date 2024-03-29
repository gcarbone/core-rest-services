require("dotenv").config();

const express = require("express");
const expressOasGenerator = require("express-oas-generator");
const { SPEC_OUTPUT_FILE_BEHAVIOR } = expressOasGenerator;
const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");

const port = process.env.PORT;

const keyStream = path.resolve(`./${process.env.SERVER_KEY}`);
const certificateStream = path.resolve(`./${process.env.SERVER_CERT}`);
const privateKey = fs.readFileSync(keyStream, "utf8");
const certificate = fs.readFileSync(certificateStream, "utf8");
const https_options = {
  key: privateKey,
  cert: certificate,
  //  passphrase: process.env.PASSPHRASE,
};

const app = express();

expressOasGenerator.handleResponses(app, {
  swaggerUiServePath: "api-docs",
  specOutputPath: "./api-docs/api-docs.json",
  specOutputFileBehavior: true,
  swaggerDocumentOptions: {
    customSiteTitle: "Core REST Services",
    customCssUrl: "/ui/core-rest-services.css",
    customJs: "/ui/core-rest-services.js",
    explorer: true,
  },
});
const logger = require("./logger");
app.use(logger.logger);
app.use(express.static("public"));
app.use(express.json());
app.post("/echo", function (req, res, next) {
  res.send(req.body);
  next();
});



app.get("/ping", function (req, res, next) {
  res.json({ alive: true });
  next();
});


// ****************  Activate only ONE auth module at a time

// PLEASE NEVER USE THIS.  FOR TESTING ONLY
const auth = require("./endpoints/auth-noauth");
// for auth-jwt
//const auth = require("./endpoints/auth-jwt");
//app.use("/auth", auth.router);

// for auth-apikey
//const auth = require("./endpoints/auth-apikey");
// ****************

//filesystem
const filesystem = require("./endpoints/filesystem");
app.use("/filesystem", auth.validate, filesystem);

//cmd
const cmd = require("./endpoints/cmd");
app.use("/cmd", auth.validate, cmd);

// active directory
const ad = require("./endpoints/ad");
app.use("/ad", auth.validate, ad);

// PGP
const pgp = require("./endpoints/pgp");
app.use("/pgp", auth.validate, pgp);

var server;
expressOasGenerator.handleRequests();
if (process.env.HTTPS === "true")
  server = https.createServer(https_options, app);
else server = http.createServer(app);

server.listen(port, () => {
  console.log(`Core REST Services running on ${port}...`);
  //listroutes(app);
});

//------------------------------------------------------------

function listroutes(app) {
  var route,
    routes = [];
  app._router.stack.forEach(function (middleware) {
    if (middleware.route) {
      // routes registered directly on the app
      routes.push(middleware.route);
    } else if (middleware.name === "router") {
      // router middleware
      middleware.handle.stack.forEach(function (handler) {
        route = handler.route;
        route && routes.push(route);
      });
    }
  });
  const op = routes
    .map((r) => {
      return { path: r.path, keys: r.keys, methods: Object.keys(r.methods) };
    })
    .sort(function compareFn(a, b) {
      if (a.path === b.path) return 0;
      else if (a.path > b.path) return 1;
      else return -1;
    });

  const out = [];
  var lastpath = "";
  for (var i = 0; i < op.length; i++) {
    if (op[i].path != lastpath) {
      out.push({
        path: op[i].path,
        methods: op
          .filter((r) => r.path === op[i].path)
          .reduce((m, r) => {
            return m + " " + r.methods;
          }, "")
          .substring(1)
          .replace(" ", ","),
      });
      lastpath = op[i].path;
    }
  }
  console.log(out);
}
