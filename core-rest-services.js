require("dotenv").config();

const express = require("express");
const expressOasGenerator = require("express-oas-generator");
const { SPEC_OUTPUT_FILE_BEHAVIOR } = expressOasGenerator;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const https = require("https");
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
app.use(express.json());
app.use(express.static('public'));
expressOasGenerator.handleResponses(app,{
  swaggerUiServePath: 'api-docs',
  specOutputPath: './api-docs/api-docs.json',
  specOutputFileBehavior: true,
  swaggerDocumentOptions: { 
    customSiteTitle: 'Core REST Services',
    customCssUrl: '/ui/core-rest-services.css',
    customJs: '/ui/core-rest-services.js',
    explorer:true
  }
});


// ****************  Activate only ONE auth module at a time
// for auth-jwt
//const auth = require("./endpoints/auth-jwt");
//app.use("/auth", auth.router);

// for auth-apikey
const auth = require("./endpoints/auth-apikey");
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


expressOasGenerator.handleRequests();
const server = https.createServer(https_options, app);
server.listen(port, () => {
  console.log(`Core REST Services running on ${port}...`);
  listroutes(app);
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
      return { path: r.path, keys:r.keys, methods: Object.keys(r.methods) };
    })
    .sort(function compareFn(a, b) {
      if (a.path === b.path) return 0;
      else if (a.path > b.path) return 1;
      else return -1;
    });
    
  const out = [];
  var lastpath = "";
  for (var i=0; i < op.length; i++) {
    if (op[i].path != lastpath) {
      out.push({
        path: op[i].path,
        methods: op.filter((r) => r.path === op[i].path).reduce((m,r)=>{return m+' '+r.methods},'').substring(1).replace(' ',','),
      });
      lastpath = op[i].path;
    }
  }
  console.log(out);
}
