import winston from "winston";
import { currentEnvironment } from "../config/config.js";

let currentTransports;
switch (currentEnvironment) {
  case "development":
    currentTransports = [
      new winston.transports.Console({ level: "debug" }),
      new winston.transports.File({ level: "error", filename: "../files/logs/errors.log" }),
    ];
    break;
  case "staging":
    currentTransports = [new winston.transports.Console({ level: "debug" })];
    break;
  case "production":
    currentTransports = [
      new winston.transports.Console({ level: "info" }),
      new winston.transports.File({ level: "error", filename: "../files/logs/errors.log" }),
    ];
    break;
  default:
    currentTransports = [new winston.transports.Console({ level: "debug" })];
    break;
}

const logger = winston.createLogger({
  transports: currentTransports,
});

export const addLogger = (req, res, next) => {
  req.logger = logger;
  //req.logger.http(`${req.method} in ${req.url} - ${new Date().toLocaleString()}`);
  next();
};
