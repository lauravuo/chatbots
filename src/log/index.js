import winston from 'winston';

const { Console } = winston.transports;

const transports = {
  default: [new Console({ json: false, timestamp: true, colorize: true })],
};

const exceptionHandlers = {
  default: [new Console({ json: false, timestamp: true, colorize: true })],
};

const config = {
  transports: transports.default,
  exceptionHandlers: exceptionHandlers.default,
  exitOnError: false,
};

export default new winston.Logger(config);
