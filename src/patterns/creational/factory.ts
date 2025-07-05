export interface Logger {
  target: string
  log(message: string): void
  error(message: string): void
}

export class ConsoleLogger implements Logger {
  constructor(public target: string) {}

  log(message: string): void {
    console.log(`LOG [${this.target}]: ${message}`)
  }

  error(message: string): void {
    console.log(`ERROR [${this.target}]: ${message}`)
  }
}

export class FileLogger implements Logger {
  constructor(public target: string) {}

  log(message: string): void {
    console.log(`LOG [${this.target}]: ${message}`)
  }

  error(message: string): void {
    console.log(`ERROR [${this.target}]: ${message}`)
  }
}

export class DatadogLogger implements Logger {
  constructor(public target: string) {}

  log(message: string): void {
    console.log(`LOG [${this.target}]: ${message}`)
  }

  error(message: string): void {
    console.log(`ERROR [${this.target}]: ${message}`)
  }
}

export class LoggerFactory {
  private readonly loggers = {
    console: ConsoleLogger,
    file: FileLogger,
    external: DatadogLogger
  }

  createLogger(type: keyof typeof this.loggers, target: string): Logger {
    const LoggerClass = this.loggers[type]
    if (!LoggerClass) throw new Error(`Logger type "${type}" is not supported.`)
    return new LoggerClass(target)
  }
}
