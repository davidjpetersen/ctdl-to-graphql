const LOG_LEVELS = ['error', 'warn', 'info', 'debug'];

class Logger {
  constructor(logLevel = 'info') {
    this.setLogLevel(logLevel);
  }

  setLogLevel(level) {
    this.logLevel = LOG_LEVELS.includes(level) ? level : 'info';
    if (!LOG_LEVELS.includes(level)) {
      console.warn(`Invalid log level: ${level}. Using default 'info'.`);
    }
  }

  log(level, ...args) {
    if (LOG_LEVELS.indexOf(level) <= LOG_LEVELS.indexOf(this.logLevel)) {
      console[level](`[${level.toUpperCase()}]`, ...args);
    }
  }
  error = (...args) => this.log('error', ...args);
  warn = (...args) => this.log('warn', ...args);
  info = (...args) => this.log('info', ...args);
  debug = (...args) => this.log('debug', ...args);
}

export default Logger;
