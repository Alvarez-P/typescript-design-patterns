import type { PatternUseCase } from '../../types'
import type { Logger } from '../creational/factory'
import { Birthday, Meeting, type Occurrence } from './bridge'

class Calendar {
  private events: Occurrence[] = []

  addEvent(event: Occurrence): void {
    this.events.push(event)
  }

  getEventsSummary(): string {
    const margin = '\t'
    return this.events
      .map(e => {
        return `\n${margin}📌: ${e.getTitle()}\n${margin}📅: ${e.getFormattedDate()} ${e.getFormattedTime()}`
      })
      .join('\n')
  }
}

export const compositeUseCase: PatternUseCase = (logger: Logger) => () => {
  const calendar = new Calendar()
  calendar.addEvent(
    new Meeting(
      'TypeScript for Beginners',
      new Date('2025-09-01 10:00'),
      new Date('2025-09-01 15:00')
    )
  )
  calendar.addEvent(
    new Meeting(
      'Design Patterns in TypeScript',
      new Date('2025-09-02 11:00'),
      new Date('2025-09-02 14:00')
    )
  )
  calendar.addEvent(new Birthday('John', new Date('1998-11-12')))
  calendar.addEvent(new Birthday('Jane', new Date('2001-08-05')))
  logger.log(calendar.getEventsSummary())
}
