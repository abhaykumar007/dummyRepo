import * as log from "loglevel";

class Logger {
  static setLevel(level: log.LogLevelDesc) {
    log.setLevel(level);
  }

  static warn(msg: string) {
    log.warn(msg);
  }

  static info(msg: string) {
    log.info(msg);
  }

  static debug(msg: string) {
    log.debug(msg);
  }

  static error(msg: string) {
    log.error(msg);
  }

  static trace(msg: string) {
    log.trace(msg);
  }
}

export default Logger;
