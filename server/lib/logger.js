const winston = require("winston");

const logger = winston.createLogger({
  levels: winston.config.syslog.levels,
  transports: [
    new winston.transports.Console({
      // max log level handled by this transport - is the max level
      level: winston.config.syslog.levels.emerg,
      handleExceptions: true,
      format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.printf(info => `${info.timestamp} - ${info.level}: ${info.message}`)
        ),
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
