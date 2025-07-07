/** biome-ignore-all lint/complexity/noStaticOnlyClass: . */
import type { PatternRunner } from '../../types'
import {
  ConsoleLogger,
  DatadogLogger,
  FileLogger,
  type Logger
} from './factory'
import type { ApiSettings } from './singleton'

export abstract class EnvironmentApiSettings {
  abstract createLogger(target: string): Logger
  abstract createSettings(): ApiSettings
}

export class DevelopmentApiSettings extends EnvironmentApiSettings {
  createLogger(target: string): Logger {
    return new ConsoleLogger(target)
  }

  createSettings(): ApiSettings {
    return {
      database: {
        host: 'localhost',
        port: 5432,
        user: 'dev_user',
        pwd: 'dev_password'
      },
      aws: {
        accessKeyId: 'dev_access_key',
        secretAccessKey: 'dev_secret_key'
      },
      port: 3000
    }
  }
}

export class ProductionApiSettings extends EnvironmentApiSettings {
  createLogger(target: string): Logger {
    return new DatadogLogger(target)
  }

  createSettings(): ApiSettings {
    return {
      database: {
        host: 'prod-db.example.com',
        port: 5432,
        user: 'prod_user',
        pwd: 'prod_password'
      },
      aws: {
        accessKeyId: 'prod_access_key',
        secretAccessKey: 'prod_secret_key'
      },
      port: 3000
    }
  }
}

export class TestingApiSettings extends EnvironmentApiSettings {
  createLogger(target: string): Logger {
    return new ConsoleLogger(target)
  }

  createSettings(): ApiSettings {
    return {
      database: {
        host: 'localhost',
        port: 5432,
        user: 'test_user',
        pwd: 'test_password'
      },
      aws: {
        accessKeyId: 'test_access_key',
        secretAccessKey: 'test_secret_key'
      },
      port: 3000
    }
  }
}

export class QAApiSettings extends EnvironmentApiSettings {
  createLogger(target: string): Logger {
    return new FileLogger(target)
  }

  createSettings(): ApiSettings {
    return {
      database: {
        host: 'qa-db.example.com',
        port: 5432,
        user: 'qa_user',
        pwd: 'qa_password'
      },
      aws: {
        accessKeyId: 'qa_access_key',
        secretAccessKey: 'qa_secret_key'
      },
      port: 3000
    }
  }
}

export class EnvironmentApiSettingsFactory {
  static getFactory(environment: string): EnvironmentApiSettings {
    switch (environment) {
      case 'development':
        return new DevelopmentApiSettings()
      case 'production':
        return new ProductionApiSettings()
      case 'testing':
        return new TestingApiSettings()
      case 'qa':
        return new QAApiSettings()
      default:
        throw new Error(`Unknown environment: ${environment}`)
    }
  }
}

export const abstractFactoryRunner: PatternRunner = (logger: Logger) => () => {
  const createApi = (settings: EnvironmentApiSettings) => {
    const apiSettings = settings.createSettings()
    logger.log(`Server running on port: ${apiSettings.port}`)
  }

  const devSettingsFactory = EnvironmentApiSettingsFactory.getFactory(
    process.env.NODE_ENV || 'development'
  )
  createApi(devSettingsFactory)
}
