import { chainOfResponsibilityUseCase } from '../patterns/behavioral/chainOfResponsibility'
import { commandUseCase } from '../patterns/behavioral/command'
import { iteratorUseCase } from '../patterns/behavioral/iterator'
import { mediatorUseCase } from '../patterns/behavioral/mediator'
import { mementoUseCase } from '../patterns/behavioral/memento'
import { observerUseCase } from '../patterns/behavioral/observer'
import { stateUseCase } from '../patterns/behavioral/state'
import { strategyUseCase } from '../patterns/behavioral/strategy'
import { templateUseCase } from '../patterns/behavioral/template'
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
import { proxyUseCase } from '../patterns/structural/proxy'
import type { PatternUseCase } from '../types'
import type { Queue } from './queue'
import type { Runner } from './runner'

export class DesignPatternsManager<
  P extends ReturnType<PatternUseCase> = ReturnType<PatternUseCase>
> {
  private readonly patternKeys: Record<string, symbol> = {
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
    FLYWEIGHT: Symbol('FLYWEIGHT'),
    PROXY: Symbol('PROXY'),
    CHAIN_OF_RESPONSIBILITY: Symbol('CHAIN_OF_RESPONSIBILITY'),
    COMMAND: Symbol('COMMAND'),
    QUEUE: Symbol('QUEUE'),
    RUNNER: Symbol('RUNNER'),
    ITERATOR: Symbol('ITERATOR'),
    MEDIATOR: Symbol('MEDIATOR'),
    MEMENTO: Symbol('MEMENTO'),
    OBSERVER: Symbol('OBSERVER'),
    STATE: Symbol('STATE'),
    STRATEGY: Symbol('STRATEGY'),
    TEMPLATE: Symbol('TEMPLATE')
  }
  private readonly patterns = new Map([
    [
      this.patternKeys.SINGLETON,
      singletonUseCase(new ConsoleLogger('SingletonPattern'))
    ],
    [
      this.patternKeys.BUILDER,
      builderUseCase(new ConsoleLogger('BuilderPattern'))
    ],
    [
      this.patternKeys.PROTOTYPE,
      prototypeUseCase(new ConsoleLogger('PrototypePattern'))
    ],
    [
      this.patternKeys.FACTORY,
      factoryUseCase(new ConsoleLogger('FactoryPattern'))
    ],
    [
      this.patternKeys.ABSTRACT_FACTORY,
      abstractFactoryUseCase(new ConsoleLogger('AbstractFactoryPattern'))
    ],
    [
      this.patternKeys.ADAPTER,
      adapterUseCase(new ConsoleLogger('AdapterPattern'))
    ],
    [
      this.patternKeys.BRIDGE,
      bridgeUseCase(new ConsoleLogger('BridgePattern'))
    ],
    [
      this.patternKeys.COMPOSITE,
      compositeUseCase(new ConsoleLogger('CompositePattern'))
    ],
    [
      this.patternKeys.DECORATOR,
      decoratorUseCase(new ConsoleLogger('DecoratorPattern'))
    ],
    [
      this.patternKeys.FACADE,
      facadeUseCase(new ConsoleLogger('FacadePattern'))
    ],
    [
      this.patternKeys.FLYWEIGHT,
      flyweightUseCase(new ConsoleLogger('FlyweightPattern'))
    ],
    [this.patternKeys.PROXY, proxyUseCase(new ConsoleLogger('ProxyPattern'))],
    [
      this.patternKeys.CHAIN_OF_RESPONSIBILITY,
      chainOfResponsibilityUseCase(
        new ConsoleLogger('ChainOfResponsibilityPattern')
      )
    ],
    [
      this.patternKeys.COMMAND,
      commandUseCase(new ConsoleLogger('CommandPattern'))
    ],
    [
      this.patternKeys.ITERATOR,
      iteratorUseCase(new ConsoleLogger('IteratorPattern'))
    ],
    [
      this.patternKeys.MEDIATOR,
      mediatorUseCase(new ConsoleLogger('MediatorPattern'))
    ],
    [
      this.patternKeys.MEMENTO,
      mementoUseCase(new ConsoleLogger('MementoPattern'))
    ],
    [
      this.patternKeys.OBSERVER,
      observerUseCase(new ConsoleLogger('ObserverPattern'))
    ],
    [this.patternKeys.STATE, stateUseCase(new ConsoleLogger('StatePattern'))],
    [
      this.patternKeys.STRATEGY,
      strategyUseCase(new ConsoleLogger('StrategyPattern'))
    ],
    [
      this.patternKeys.TEMPLATE,
      templateUseCase(new ConsoleLogger('TemplatePattern'))
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
    return this.patternKeys
  }

  private setup() {
    for (const pattern of this.patterns.values()) {
      this.queue.enqueue(pattern as P)
    }
  }
}
