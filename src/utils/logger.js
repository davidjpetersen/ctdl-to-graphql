class Logger {
  constructor(logLevel = 'info') {
    this.logLevel = logLevel;
    this.levels = ['error', 'warn', 'info', 'debug'];
  }

  setLogLevel(level) {
    if (this.levels.includes(level)) {
      this.logLevel = level;
    } else {
      console.warn(`Invalid log level: ${level}. Using default 'info'.`);
    }
  }

  shouldLog(level) {
    return this.levels.indexOf(level) <= this.levels.indexOf(this.logLevel);
  }

  error(...args) {
    if (this.shouldLog('error')) {
      console.error('[ERROR]', ...args);
    }
  }

  warn(...args) {
    if (this.shouldLog('warn')) {
      console.warn('[WARN]', ...args);
    }
  }

  info(...args) {
    if (this.shouldLog('info')) {
      console.info('[INFO]', ...args);
    }
  }

  debug(...args) {
    if (this.shouldLog('debug')) {
      console.debug('[DEBUG]', ...args);
    }
  }
}

const logger = new Logger();

export default logger;
