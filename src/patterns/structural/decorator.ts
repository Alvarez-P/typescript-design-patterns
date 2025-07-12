import crypto from 'node:crypto'
import type { PatternUseCase } from '../../types'
import type { Logger } from '../creational/factory'

interface IStringTransformer {
  raw(): string
  transform(): string
}

class StringTransformer implements IStringTransformer {
  constructor(private string: string) {}
  raw(): string {
    return this.string
  }
  transform(): string {
    return this.string
  }
}

class BaseStringDecorator implements IStringTransformer {
  constructor(protected wrapped: IStringTransformer) {}
  raw(): string {
    return this.wrapped.raw()
  }
  transform(): string {
    return this.wrapped.transform()
  }
}

class UpperCaseDecorator extends BaseStringDecorator {
  transform(): string {
    return this.wrapped.transform().toUpperCase()
  }
}

class ReverseDecorator extends BaseStringDecorator {
  transform(): string {
    return this.wrapped.transform().split('').reverse().join('')
  }
}

class EncryptDecorator extends BaseStringDecorator {
  transform(): string {
    return crypto
      .createHash('sha256')
      .update(this.wrapped.transform())
      .digest('hex')
  }
}

export const decoratorUseCase: PatternUseCase = (logger: Logger) => () => {
  const source = new StringTransformer('Hello World')
  let transformer = new UpperCaseDecorator(source)
  transformer = new ReverseDecorator(transformer)
  logger.log(`Raw: ${transformer.raw()}`)
  logger.log(`Before encrypt: ${transformer.transform()}`)
  transformer = new EncryptDecorator(transformer)
  logger.log(`Result: ${transformer.transform()}`)
}
