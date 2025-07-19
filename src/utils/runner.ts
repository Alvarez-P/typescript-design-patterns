import type { Logger } from '../patterns/creational/factory'

export class Runner {
  constructor(private logger: Logger) {}

  public async run<
    T extends (...args: unknown[]) => unknown | Promise<unknown>
  >(work: T): Promise<void> {
    try {
      this.logger.log(`Executing task...`)
      const result = work()
      if (result instanceof Promise) await result
      this.logger.log(`Task executed.`)
    } catch (error) {
      this.logger.error(`Error executing task: ${error}`)
      process.exit()
    }
  }
}
