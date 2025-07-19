import type { PatternUseCase } from '../../types'
import type { Logger } from '../creational/factory'

type Sorteable = Record<
  string,
  string | number | boolean | Date | null | undefined
> &
  Record<string, unknown>

type SortByString<S extends Sorteable> = keyof {
  [K in keyof S]: S[K] extends string ? K : never
}

type SortByNumber<S extends Sorteable> = keyof {
  [K in keyof S]: S[K] extends number | boolean | Date ? K : never
}

interface SortStrategy<S extends Sorteable> {
  sortBy: keyof S
  direction: 'asc' | 'desc'
  sort(items: S[]): S[]
}

class Sorter<S extends Sorteable> {
  constructor(private items: S[]) {}

  sort(sortStrategy: SortStrategy<S>) {
    return sortStrategy.sort(this.items)
  }
}

class StringSorterStrategy<S extends Sorteable> implements SortStrategy<S> {
  constructor(
    public sortBy: SortByString<S>,
    public direction: 'asc' | 'desc'
  ) {}

  sort(items: S[]) {
    return items.sort((a, b) => {
      const aValue = a[this.sortBy] as string
      const bValue = b[this.sortBy] as string
      if (this.direction === 'asc') return aValue.localeCompare(bValue)
      else return bValue.localeCompare(aValue)
    })
  }
}

class NumberSorterStrategy<S extends Sorteable> implements SortStrategy<S> {
  constructor(
    public sortBy: SortByNumber<S>,
    public direction: 'asc' | 'desc'
  ) {}

  sort(items: S[]) {
    return items.sort((a, b) => {
      const aValue = a[this.sortBy] as number | boolean | Date
      const bValue = b[this.sortBy] as number | boolean | Date
      const order =
        this.direction === 'asc' ? [aValue, bValue] : [bValue, aValue]
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

  const sortedByName = sorter
    .sort(new StringSorterStrategy('name', 'asc'))
    .map(({ name }) => ({ name }))
  const sortedByHeight = sorter
    .sort(new NumberSorterStrategy('height', 'desc'))
    .map(({ name }) => ({ name }))
  const sortedByBirthday = sorter
    .sort(new NumberSorterStrategy('birthday', 'asc'))
    .map(({ name }) => ({ name }))

  logger.log(`Sorting by name (asc): ${JSON.stringify(sortedByName)}`)
  logger.log(`Sorting by height (desc): ${JSON.stringify(sortedByHeight)}`)
  logger.log(`Sorting by birthday (asc): ${JSON.stringify(sortedByBirthday)}`)
}
