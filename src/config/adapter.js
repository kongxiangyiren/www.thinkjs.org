const os = require('os');
const fileCache = require('think-cache-file');
const ejs = require('think-view-ejs');
const fileSession = require('think-session-file');
const mysql = require('think-model-mysql');
const { Console, File, DateFile } = require('think-logger3');
const path = require('path');
const isDev = think.env === 'development';
const isNow = think.env === 'now';
const isPkg = think.env === 'pkg';

/**
 * cache adapter config
 * @type {Object}
 */
exports.cache = {
  type: isNow ? 'tmpFile' : 'file',
  common: {
    timeout: 60 * 60 * 1000 // millisecond
  },
  file: {
    handle: fileCache,
    cachePath: path.join(think.RUNTIME_PATH, 'cache'), // absoulte path is necessarily required
    pathDepth: 1,
    gcInterval: 60 * 60 * 1000 // gc interval
  },
  tmpFile: {
    handle: fileCache,
    cachePath: path.join(os.tmpdir(), 'cache'),
    pathDepth: 1,
    gcInterval: 60 * 60 * 1000
  }
};

/**
 * model adapter config
 * @type {Object}
 */
exports.model = {
  type: 'mysql',
  common: {
    logConnect: isDev,
    logSql: isDev,
    logger: msg => think.logger.info(msg)
  },
  mysql: {
    handle: mysql,
    database: '',
    prefix: 'think_',
    encoding: 'utf8',
    host: '127.0.0.1',
    port: '',
    user: 'root',
    password: 'root',
    dateStrings: true
  }
};

/**
 * session adapter config
 * @type {Object}
 */
exports.session = {
  type: isNow ? 'tmpFile' : 'file',
  common: {
    cookie: {
      name: 'thinkjs'
      // keys: ['werwer', 'werwer'],
      // signed: true
    }
  },
  file: {
    handle: fileSession,
    sessionPath: path.join(think.RUNTIME_PATH, 'session')
  },
  tmpFile: {
    handle: fileSession,
    sessionPath: path.join(os.tmpdir(), 'session')
  }
};

/**
 * view adapter config
 * @type {Object}
 */
exports.view = {
  type: 'ejs',
  common: {
    viewPath: path.join(process.cwd(), 'view'),
    sep: '_',
    extname: '.html'
  },
  ejs: {
    handle: ejs
  }
};

/**
 * logger adapter config
 * @type {Object}
 */
exports.logger = {
  type: isDev || isNow ? 'console' : 'dateFile',
  console: {
    handle: Console
  },
  file: {
    handle: File,
    backups: 10, // max chunk number
    absolute: true,
    maxLogSize: 50 * 1024, // 50M
    filename: path.join(think.ROOT_PATH, 'logs/app.log')
  },
  dateFile: {
    handle: DateFile,
    level: 'ALL',
    absolute: true,
    pattern: '-yyyy-MM-dd',
    alwaysIncludePattern: true,
    filename: path.join(isPkg ? process.cwd() : think.ROOT_PATH, 'logs/app.log')
  }
};
