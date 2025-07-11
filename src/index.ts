import { ConsoleLogger } from './patterns/creational/factory'
import type { PatternUseCase } from './types'
import { DesignPatternsManager } from './utils/manager'
import { Queue } from './utils/queue'
import { Runner } from './utils/runner'
;(async () => {
  const managerLogger = new ConsoleLogger('DesignPatternsManager')
  const queueLogger = new ConsoleLogger('Queue')

  const manager = new DesignPatternsManager(
    managerLogger,
    new Queue<ReturnType<PatternUseCase>>(new Runner(queueLogger)),
    new Runner(managerLogger)
  )
  await manager.runAll()
})()
