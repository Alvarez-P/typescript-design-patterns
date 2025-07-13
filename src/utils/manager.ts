import { abstractFactoryUseCase } from '../patterns/creational/abstract-factory'
import { builderUseCase } from '../patterns/creational/builder'
import {
  ConsoleLogger,
  factoryUseCase,
  type Logger
} from '../patterns/creational/factory'
import { prototypeUseCase } from '../patterns/creational/prototype'
import { singletonUseCase } from '../patterns/creational/singleton'
import { adapterUseCase } from '../patterns/structural/adapter'
import { bridgeUseCase } from '../patterns/structural/bridge'
import { compositeUseCase } from '../patterns/structural/composite'
import { decoratorUseCase } from '../patterns/structural/decorator'
import { facadeUseCase } from '../patterns/structural/facade'
import { flyweightUseCase } from '../patterns/structural/flyweight'
import type { PatternUseCase } from '../types'
import type { Queue } from './queue'
import type { Runner } from './runner'

export class DesignPatternsManager<
  P extends ReturnType<PatternUseCase> = ReturnType<PatternUseCase>
> {
  private readonly patterKeys: Record<string, symbol> = {
    SINGLETON: Symbol('SINGLETON'),
    BUILDER: Symbol('BUILDER'),
    PROTOTYPE: Symbol('PROTOTYPE'),
    FACTORY: Symbol('FACTORY'),
    ABSTRACT_FACTORY: Symbol('ABSTRACT_FACTORY'),
    ADAPTER: Symbol('ADAPTER'),
    BRIDGE: Symbol('BRIDGE'),
    COMPOSITE: Symbol('COMPOSITE'),
    DECORATOR: Symbol('DECORATOR'),
    FACADE: Symbol('FACADE'),
    FLYWEIGHT: Symbol('FLYWEIGHT')
  }
  private readonly patterns = new Map([
    [
      this.patterKeys.SINGLETON,
      singletonUseCase(new ConsoleLogger('SingletonPattern'))
    ],
    [
      this.patterKeys.BUILDER,
      builderUseCase(new ConsoleLogger('BuilderPattern'))
    ],
    [
      this.patterKeys.PROTOTYPE,
      prototypeUseCase(new ConsoleLogger('PrototypePattern'))
    ],
    [
      this.patterKeys.FACTORY,
      factoryUseCase(new ConsoleLogger('FactoryPattern'))
    ],
    [
      this.patterKeys.ABSTRACT_FACTORY,
      abstractFactoryUseCase(new ConsoleLogger('AbstractFactoryPattern'))
    ],
    [
      this.patterKeys.ADAPTER,
      adapterUseCase(new ConsoleLogger('AdapterPattern'))
    ],
    [this.patterKeys.BRIDGE, bridgeUseCase(new ConsoleLogger('BridgePattern'))],
    [
      this.patterKeys.COMPOSITE,
      compositeUseCase(new ConsoleLogger('CompositePattern'))
    ],
    [
      this.patterKeys.DECORATOR,
      decoratorUseCase(new ConsoleLogger('DecoratorPattern'))
    ],
    [this.patterKeys.FACADE, facadeUseCase(new ConsoleLogger('FacadePattern'))],
    [
      this.patterKeys.FLYWEIGHT,
      flyweightUseCase(new ConsoleLogger('FlyweightPattern'))
    ]
  ])

  constructor(
    private logger: Logger,
    private queue: Queue<P>,
    private runner: Runner
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
    await this.runner.run(pattern)
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
