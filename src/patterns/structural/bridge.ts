import type { PatternUseCase } from '../../types'
import type { Logger } from '../creational/factory'

export class Occurrence {
  constructor(
    public title: string,
    public startDate: Date,
    public endDate: Date,
    public description: string,
    public location: string
  ) {}

  getDuration(): number {
    return this.endDate.getTime() - this.startDate.getTime()
  }

  isActive(): boolean {
    const now = new Date()
    return now >= this.startDate && now <= this.endDate
  }

  isBefore(): boolean {
    const now = new Date()
    return now < this.startDate
  }

  isAfter(): boolean {
    const now = new Date()
    return now > this.endDate
  }

  getStatus(): 'upcoming' | 'active' | 'completed' {
    if (this.isActive()) return 'active'
    if (this.isBefore()) return 'upcoming'
    else return 'completed'
  }

  getTitle(): string {
    return this.title
  }

  getFormattedDate(): string {
    return this.startDate.toLocaleString()
  }

  getFormattedTime(): string {
    return this.startDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}

export class Birthday extends Occurrence {
  constructor(
    public name: string,
    public date: Date,
    public location: string = '',
    public description: string = ''
  ) {
    super(
      `Birthday of ${name}`,
      new Date(date.setHours(0, 0, 0, 0)),
      new Date(date.setHours(23, 59, 59, 999)),
      description,
      location
    )
  }

  getFormattedDate(): string {
    return this.date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  getFormattedTime(): string {
    return ''
  }
}

export class Meeting extends Occurrence {
  constructor(
    public subject: string,
    public startDate: Date,
    public endDate: Date,
    public location: string = '',
    public description: string = ''
  ) {
    super(subject, startDate, endDate, description, location)
  }

  getFormattedDate(): string {
    return this.startDate.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  getFormattedTime(): string {
    const from = this.startDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
    const to = this.endDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
    return `${from} - ${to}`
  }
}

abstract class OccurrenceRenderer {
  constructor(public event: Occurrence) {}

  abstract render(): string
}

class SummaryOccurrenceRenderer extends OccurrenceRenderer {
  private iconMap = {
    active: '🕒️',
    upcoming: '🔜',
    completed: '✔️ '
  }

  render(): string {
    const status = this.event.getStatus()
    return `\t${this.iconMap[status]} ${this.event.getTitle()}`
  }
}

class DetailedOccurrenceRenderer extends OccurrenceRenderer {
  render(): string {
    const location = this.event.location
      ? `\n\t\t\t📍: ${this.event.location}`
      : ''
    return `\t${this.event.title}\n\t\t\t${this.event.description}${location}\n\t\t\t📅: ${this.event.getFormattedDate()}`
  }
}

const mockEvents: Occurrence[] = [
  new Birthday('John Doe', new Date('1990-01-01')),
  new Meeting(
    'Design Patterns in TypeScript',
    new Date('2025-09-01 12:00'),
    new Date('2025-09-01 15:00'),
    'Zoom',
    'Learn how to implement design patterns in TypeScript'
  )
]

export const bridgeUseCase: PatternUseCase = (logger: Logger) => () => {
  logger.log('Upcoming events:')
  for (const e of mockEvents) {
    if (e.isBefore()) {
      const detailedRenderer = new DetailedOccurrenceRenderer(e)
      logger.log(detailedRenderer.render())
    }
  }
  logger.log('All events:')
  for (const e of mockEvents) {
    const summaryRenderer = new SummaryOccurrenceRenderer(e)
    logger.log(summaryRenderer.render())
  }
}
