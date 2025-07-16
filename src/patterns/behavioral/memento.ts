import type { PatternUseCase } from '../../types'
import type { Logger } from '../creational/factory'

class Sale {
  constructor(
    public amount: number,
    public date: Date
  ) {}

  info(): string {
    return `\n\t[${this.date.toISOString()}]: $${this.amount}`
  }
}

class SummaryMemento {
  constructor(
    public sales: Sale[],
    public createdAt: Date
  ) {}

  showSales(): string {
    return `\n\tReport at ${this.createdAt.toISOString()}: \n${this.sales
      .map(sale => `${sale.info()}`)
      .join('')}`.trimEnd()
  }
}

class SalesManager {
  private memento: SummaryMemento | null = null

  constructor(private sales: Sale[] = []) {}

  addSale(amount: number, date: Date = new Date()): void {
    this.sales.push(new Sale(amount, date))
  }

  createSummary(): SummaryMemento {
    return new SummaryMemento(
      [...this.sales],
      this.memento?.createdAt || new Date()
    )
  }

  restore(memento: SummaryMemento): void {
    this.sales = memento.sales
    this.memento = memento
  }

  showSales(): string {
    return this.sales
      .map(sale => sale.info())
      .join('')
      .trimEnd()
  }
}

export const mementoUseCase: PatternUseCase = (logger: Logger) => () => {
  const summary = new SalesManager()
  summary.addSale(119)
  summary.addSale(20)

  const saved = summary.createSummary()
  logger.log(`Saved: ${saved.showSales()}`)

  summary.addSale(30)
  logger.log(`After new sale: ${summary.showSales()}`)

  summary.restore(saved)
  logger.log(`Restored: ${summary.showSales()}`)
}
