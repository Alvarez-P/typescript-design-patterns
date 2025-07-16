import type { PatternUseCase } from '../../types'
import type { Logger } from '../creational/factory'

interface DateFormatter {
  separator: string
  yyyymmdd(date: Date): string
  ddmmyyyy(date: Date): string
}

class DateFormatterAdapter implements DateFormatter {
  constructor(public separator: string = '-') {}

  yyyymmdd(date: Date): string {
    return new Date(date)
      .toISOString()
      .slice(0, 10)
      .split('-')
      .join(this.separator)
  }

  ddmmyyyy(date: Date): string {
    return new Date(date)
      .toISOString()
      .slice(0, 10)
      .split('-')
      .reverse()
      .join(this.separator)
  }
}

class IntlDateFormatterAdapter implements DateFormatter {
  constructor(public separator: string = '-') {}

  yyyymmdd(date: Date): string {
    return new Intl.DateTimeFormat('es', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
      .format(date)
      .split('/')
      .reverse()
      .join(this.separator)
  }

  ddmmyyyy(date: Date): string {
    return new Intl.DateTimeFormat('es', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
      .format(date)
      .split('/')
      .join(this.separator)
  }
}

export const adapterUseCase: PatternUseCase = (logger: Logger) => () => {
  const formatter = (f: DateFormatter, date: Date) => {
    logger.log(`\tYYYYMMDD: ${f.yyyymmdd(date)}`)
    logger.log(`\tDDMMYYYY: ${f.ddmmyyyy(date)}`)
  }
  const dateFormatterAdapter = new DateFormatterAdapter()
  const intlDateFormatterAdapter = new IntlDateFormatterAdapter()
  const date = new Date()

  logger.log(`Formatting with Date`)
  formatter(dateFormatterAdapter, date)
  logger.log(`Formatting with Intl`)
  formatter(intlDateFormatterAdapter, date)
}
