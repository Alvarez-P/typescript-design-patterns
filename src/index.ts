import { ConsoleLogger } from './patterns/creational/factory'
import type { PatternRunner } from './types'
import { Queue } from './utils/queue'
import { DesignPatternsRunner } from './utils/runner'
;(async () => {
  const runner = new DesignPatternsRunner(
    new Queue<ReturnType<PatternRunner>>(new ConsoleLogger('Queue')),
    new ConsoleLogger('Runner')
  )
  await runner.runAll()
})()
