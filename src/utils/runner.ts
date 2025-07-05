import { ConsoleLogger, type Logger } from '../patterns/creational/factory'
import { prototypeRunner } from '../patterns/creational/prototype'
import { singletonRunner } from '../patterns/creational/singleton'
import type { PatternRunner } from '../types'
import type { Queue } from './queue'

export class DesignPatternsRunner<
	P extends ReturnType<PatternRunner> = ReturnType<PatternRunner>
> {
	private readonly patterKeys: Record<string, symbol> = {
		SINGLETON: Symbol('SINGLETON'),
		PROTOTYPE: Symbol('PROTOTYPE')
	}
	private readonly patterns = new Map([
		[
			this.patterKeys.SINGLETON,
			singletonRunner(new ConsoleLogger('SingletonPattern'))
		],
		[
			this.patterKeys.PROTOTYPE,
			prototypeRunner(new ConsoleLogger('PrototypePattern'))
		]
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
