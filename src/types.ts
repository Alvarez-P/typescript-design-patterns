import type { Logger } from './patterns/creational/factory'

export type PatternUseCase = (logger: Logger) => () => void | Promise<void>
