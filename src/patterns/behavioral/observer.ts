import type { PatternUseCase } from '../../types'
import type { Logger } from '../creational/factory'

class Issue {
  constructor(public title: string) {}
}

class Developer {
  constructor(public name: string) {}

  notify(issue: Issue) {
    return `${this.name} has been notified of a new issue: ${issue.title}`
  }
}

class Board {
  private subscribers: Developer[] = []

  subscribe(subscriber: Developer) {
    this.subscribers.push(subscriber)
    return this
  }

  addIssue(issue: Issue) {
    return this.subscribers.reduce((t, subscriber) => {
      return t.concat(`\n\t${subscriber.notify(issue)}`)
    }, '')
  }
}

export const observerUseCase: PatternUseCase = (logger: Logger) => () => {
  const johnDoe = new Developer('John Doe')
  const anaSmith = new Developer('Ana Smith')
  const josephMiller = new Developer('Joseph Miller')

  const board = new Board()
  board.subscribe(johnDoe).subscribe(anaSmith).subscribe(josephMiller)

  logger.log(board.addIssue(new Issue('Implement a new feature')))
}
