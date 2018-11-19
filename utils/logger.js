'use strict';

const winston = require('winston');
require('winston-daily-rotate-file')

const fs = require('fs');

const logDir = 'log';
if (!fs.existsSync(logDir)) {
 fs.mkdirSync(logDir);
}

const tsFormat = () => (new Date()).toLocaleTimeString();

module.exports = (prefix) => new winston.Logger({
 transports: [
   new winston.transports.Console({
     level: 'debug',
     colorize: true,
     label: prefix
   }),
   new winston.transports.DailyRotateFile({
     timestamp: tsFormat,
     datePattern: 'YYYY-MM-DD',
     level: 'debug',
     filename: `${logDir}/%DATE%-logs.log`,
     label: prefix
   })
 ]
});