const winston = require("winston");

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      timestamp: true,
      level: "debug",
      handleExceptions: true,
      json: false,
      colorize: true,
    }),
  ],
  exitOnError: false,
});

module.exports = logger;
module.exports.stream = {
  write: (message) => {
    logger.log("info", message.replace(/\n$/, ""));
  },
};
