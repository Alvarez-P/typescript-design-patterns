import type { Logger } from '../patterns/creational/factory'

export class Queue<
	T extends (...args: unknown[]) => unknown | Promise<unknown>
> {
	private tasks: T[] = []

	constructor(private logger: Logger) {}

	public enqueue(task: T): void {
		this.tasks.push(task)
	}

	public dequeue(): T | undefined {
		return this.tasks.shift()
	}

	public isEmpty(): boolean {
		return this.tasks.length === 0
	}

	public size(): number {
		return this.tasks.length
	}

	public async execute(): Promise<void> {
		while (this.tasks.length) {
			const func = this.dequeue()
			if (!func) continue
			try {
        this.logger.log(`Executing task...`)
				const result = func()
				if (result instanceof Promise) await result
        this.logger.log(`Task executed.`)
			} catch (error) {
				this.logger.error(`Error executing task: ${error}`)
				process.exit(1)
			}
		}
	}
}
