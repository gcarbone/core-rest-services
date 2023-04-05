require("dotenv").config();
const os = require("os");
const fs = require('fs-extra');
const path = require('path');
var Service = require('node-windows').Service;
if (!os.platform().startsWith('win')) throw Error('This is not a Windows machine.');

// Create a new service object
const svcDef = {
  name:'Core REST Services',
  description: 'RESTify every way to access your data',
  script: 'core-rest-services.js',
  nodeOptions: [
    '--harmony',
    '--max_old_space_size=4096'
  ],
  workingDirectory: path.join(__dirname,'/../'),
  allowServiceLogon: true
};

var svc = new Service(svcDef);
if (process.env.WIN_SVC_ACCOUNT && process.env.WIN_SVC_DOMAIN && process.env.WIN_SVC_PASSWORD){
  svc.logOnAs.domain = process.env.WIN_SVC_DOMAIN;
  svc.logOnAs.account = process.env.WIN_SVC_ACCOUNT;
  svc.logOnAs.password = process.env.WIN_SVC_PASSWORD;
}
// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});
svc.on('uninstall',function(){
  console.log('Uninstall complete.');
  console.log('The service exists: ',svc.exists);
});
svc.on('start',function(){
  console.log("Service Started!");
});
svc.on('stop',function(){
  console.log("Service Stopped!");
});
svc.on('error',function(){
  console.log("Error!");
});

switch (process.argv[2]){
  case 'install':
    svc.install();
    break;
  case 'uninstall':
    svc.uninstall();
    break;
  case 'start':
    svc.start();
    break;
  case 'stop':
    svc.stop();
    break;
  default:
    console.error('Expected [ install | uninstall | start | stop ]');
    process.exit(1);
}
