import type { PatternUseCase } from '../../types'
import type { Logger } from './factory'

export interface ApiSettings {
  database: {
    host: string
    port: number
    user: string
    pwd: string
  }
  aws: {
    accessKeyId: string
    secretAccessKey: string
  }
  port: number
}

class DevelopmentApiSettings implements ApiSettings {
  public database = {
    host: 'localhost',
    port: 5432,
    user: 'dev_user',
    pwd: 'dev_password'
  }
  public aws = {
    accessKeyId: 'dev_access_key',
    secretAccessKey: 'dev_secret_key'
  }
  public port = 3000

  static #instance: ApiSettings | null = null

  private constructor(logger: Logger) {
    logger.log('DevelopmentApiSettings instance created.')
  }

  static getInstance(logger: Logger): DevelopmentApiSettings {
    if (!DevelopmentApiSettings.#instance) {
      DevelopmentApiSettings.#instance = new DevelopmentApiSettings(logger)
    }
    return DevelopmentApiSettings.#instance
  }
}

export const singletonUseCase: PatternUseCase = (logger: Logger) => () => {
  const settings = DevelopmentApiSettings.getInstance(logger)
  const secondSettings = DevelopmentApiSettings.getInstance(logger)

  if (settings === secondSettings) {
    logger.log('✅ Both settings instances are the same.')
  }
}
