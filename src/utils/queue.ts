import type { Runner } from './runner'

export class Queue<
  T extends (...args: unknown[]) => unknown | Promise<unknown>
> {
  private tasks: T[] = []

  constructor(private runner: Runner) {}

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
      await this.runner.run(func)
    }
  }
}
