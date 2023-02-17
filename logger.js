require("dotenv").config();
const path = require("path");
var jsonFormat = require("json-format");
const winston = require("winston");
const levels = process.env.LOG_LEVELS;
const logToConsole = process.env.LOG_TO_CONSOLE;
const logDir = process.env.LOG_FILE_DIR;
const logBaseName = process.env.LOG_FILE_BASE_NAME;

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "user-service" },
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
      level: "silly",
    }),
    new winston.transports.File({ filename: path.join(logDir,logBaseName) + '.log', level: "silly" }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
//if (process.env.NODE_ENV !== 'production') {
//  logger.add(new winston.transports.Console({
//    format: winston.format.simple(),
//  }));
//}

// TODO: add log file
// rotating logs?

function loggerfunc(req, res, next) {
  const start = process.hrtime();
  const durationInMilliseconds = getActualRequestDurationInMilliseconds(start);
  req.responseTime = durationInMilliseconds + " ms";
  logReqRes(req, res);
  next();
}

const getActualRequestDurationInMilliseconds = (start) => {
  const NS_PER_SEC = 1e9; // convert to nanoseconds
  const NS_TO_MS = 1e6; // convert to milliseconds
  const diff = process.hrtime(start);
  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};

function logReqRes(req, res) {
  const oldWrite = res.write;
  const oldEnd = res.end;

  const chunks = [];

  res.write = (...restArgs) => {
    chunks.push(Buffer.from(restArgs[0]));
    oldWrite.apply(res, restArgs);
  };

  res.end = (...restArgs) => {
    if (restArgs[0]) {
      chunks.push(Buffer.from(restArgs[0]));
    }
    var body = Buffer.concat(chunks).toString("utf8");

    if (IsJsonString(body)) body = JSON.parse(body);

    logger.debug(
      jsonFormat({
        responseTime: req.responseTime,
        time: new Date().toUTCString(),
        fromIP: req.headers["x-forwarded-for"] || req.connection.remoteAddress,
        method: req.method,
        originalUri: req.originalUrl,
        uri: req.url,
        requestData: req.body,
        responseData: body,
        referer: req.headers.referer || "",
        ua: req.headers["user-agent"],
      })
    );

    oldEnd.apply(res, restArgs);
  };

  //next();
}

function IsJsonString(str) {
  try {
    var json = JSON.parse(str);
    return typeof json === "object";
  } catch (e) {
    return false;
  }
}
module.exports = {
  logger: loggerfunc,
  logReqRes: logReqRes,
};
