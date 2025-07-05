import type { Logger } from './patterns/creational/factory'

export type PatternRunner = (logger: Logger) => () => void | Promise<void>
