import type { PatternUseCase } from '../../types'
import type { Logger } from '../creational/factory'

type Sorteable = Record<
  string,
  string | number | boolean | Date | null | undefined
> &
  Record<string, unknown>

interface SortStrategy<S extends Sorteable> {
  sort(items: S[], sortBy: keyof S, direction: 'asc' | 'desc'): S[]
}

class Sorter<S extends Sorteable> {
  constructor(private items: S[]) {}

  sort(sortBy: keyof S, direction: 'asc' | 'desc', strategy?: SortStrategy<S>) {
    if (strategy) return strategy.sort(this.items, sortBy, direction)
    if (typeof this.items[0][sortBy] === 'string')
      return new StringSorterStrategy<S>().sort(this.items, sortBy, direction)
    return new NumberSorterStrategy<S>().sort(this.items, sortBy, direction)
  }
}

class StringSorterStrategy<S extends Sorteable> implements SortStrategy<S> {
  sort(items: S[], sortBy: keyof S, direction: 'asc' | 'desc') {
    return items.sort((a, b) => {
      const aValue = a[sortBy] as string
      const bValue = b[sortBy] as string
      if (direction === 'asc') return aValue.localeCompare(bValue)
      else return bValue.localeCompare(aValue)
    })
  }
}

class NumberSorterStrategy<S extends Sorteable> implements SortStrategy<S> {
  sort(items: S[], sortBy: keyof S, direction: 'asc' | 'desc') {
    return items.sort((a, b) => {
      const aValue = a[sortBy] as number | boolean | Date
      const bValue = b[sortBy] as number | boolean | Date
      const order = direction === 'asc' ? [aValue, bValue] : [bValue, aValue]
      if (order[0] > order[1]) return 1
      else if (order[0] < order[1]) return -1
      else return 0
    })
  }
}

export const strategyUseCase: PatternUseCase = (logger: Logger) => () => {
  const sorter = new Sorter([
    { name: 'John', height: 1.71, birthday: new Date('1995-01-01') },
    { name: 'Alice', height: 1.65, birthday: new Date('1990-05-05') },
    { name: 'Bob', height: 1.83, birthday: new Date('1985-03-03') }
  ])

  const sortedByName = sorter.sort('name', 'asc').map(({ name }) => ({ name }))
  const sortedByHeight = sorter
    .sort('height', 'desc')
    .map(({ name }) => ({ name }))
  const sortedByBirthday = sorter
    .sort('birthday', 'asc')
    .map(({ name }) => ({ name }))

  logger.log(`Sorting by name (asc): ${JSON.stringify(sortedByName)}`)
  logger.log(`Sorting by height (desc): ${JSON.stringify(sortedByHeight)}`)
  logger.log(`Sorting by birthday (asc): ${JSON.stringify(sortedByBirthday)}`)
}
