import { abstractFactoryRunner } from '../patterns/creational/abstract-factory'
import { builderRunner } from '../patterns/creational/builder'
import {
  ConsoleLogger,
  factoryRunner,
  type Logger
} from '../patterns/creational/factory'
import { prototypeRunner } from '../patterns/creational/prototype'
import { singletonRunner } from '../patterns/creational/singleton'
import { adapterRunner } from '../patterns/structural/adapter'
import { bridgeRunner } from '../patterns/structural/bridge'
import type { PatternRunner } from '../types'
import type { Queue } from './queue'

export class DesignPatternsRunner<
  P extends ReturnType<PatternRunner> = ReturnType<PatternRunner>
> {
  private readonly patterKeys: Record<string, symbol> = {
    SINGLETON: Symbol('SINGLETON'),
    BUILDER: Symbol('BUILDER'),
    PROTOTYPE: Symbol('PROTOTYPE'),
    FACTORY: Symbol('FACTORY'),
    ABSTRACT_FACTORY: Symbol('ABSTRACT_FACTORY'),
    ADAPTER: Symbol('ADAPTER'),
    BRIDGE: Symbol('BRIDGE')
  }
  private readonly patterns = new Map([
    [
      this.patterKeys.SINGLETON,
      singletonRunner(new ConsoleLogger('SingletonPattern'))
    ],
    [
      this.patterKeys.BUILDER,
      builderRunner(new ConsoleLogger('BuilderPattern'))
    ],
    [
      this.patterKeys.PROTOTYPE,
      prototypeRunner(new ConsoleLogger('PrototypePattern'))
    ],
    [
      this.patterKeys.FACTORY,
      factoryRunner(new ConsoleLogger('FactoryPattern'))
    ],
    [
      this.patterKeys.ABSTRACT_FACTORY,
      abstractFactoryRunner(new ConsoleLogger('AbstractFactoryPattern'))
    ],
    [
      this.patterKeys.ADAPTER,
      adapterRunner(new ConsoleLogger('AdapterPattern'))
    ],
    [this.patterKeys.BRIDGE, bridgeRunner(new ConsoleLogger('BridgePattern'))]
  ])

  constructor(
    private queue: Queue<P>,
    private logger: Logger
  ) {
    this.setup()
  }

  public async runAll(): Promise<void> {
    await this.queue.execute()
  }

  public async run(patterKey: symbol): Promise<void> {
    const pattern = this.patterns.get(patterKey)
    if (!pattern) {
      this.logger.error(`Pattern does not exist.`)
      return
    }
    try {
      const result = pattern()
      if (result instanceof Promise) await result
    } catch (error) {
      this.logger.error(`Error executing pattern: ${error}`)
      process.exit(1)
    }
  }

  public getPatterns() {
    return this.patterKeys
  }

  private setup() {
    for (const pattern of this.patterns.values()) {
      this.queue.enqueue(pattern as P)
    }
  }
}
