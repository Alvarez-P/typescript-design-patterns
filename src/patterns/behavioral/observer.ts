import type { PatternUseCase } from '../../types'
import type { Logger } from '../creational/factory'

interface Subscriber {
  name: string
  notify: (issue: Issue) => string
}

class Issue {
  constructor(public title: string) {}
}

class Developer implements Subscriber {
  constructor(public name: string) {}

  notify(issue: Issue) {
    return `${this.name} has been notified of a new issue: ${issue.title}`
  }
}

class ProjectManager implements Subscriber {
  constructor(public name: string) {}

  notify(issue: Issue) {
    return `${this.name} has been notified of a new issue: ${issue.title}`
  }
}

class Board {
  private subscribers: Subscriber[] = []

  subscribe(subscriber: Subscriber) {
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
  const josephMiller = new ProjectManager('Joseph Miller')

  const board = new Board()
  board.subscribe(johnDoe).subscribe(anaSmith).subscribe(josephMiller)

  logger.log(board.addIssue(new Issue('Implement a new feature')))
}
