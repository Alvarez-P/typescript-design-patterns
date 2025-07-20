import type { PatternUseCase } from '../../types'
import type { Logger } from '../creational/factory'

interface Media {
  name: string
  cost: number
  accept(visitor: ReporterVisitor): void
}

class Movie implements Media {
  constructor(
    public name: string,
    public cost: number,
    public duration: number
  ) {}

  accept(visitor: ReporterVisitor) {
    visitor.visit(this)
  }
}

class Game implements Media {
  constructor(
    public name: string,
    public cost: number,
    public platform: string
  ) {}

  accept(visitor: ReporterVisitor) {
    visitor.visit(this)
  }
}

interface ReporterVisitor {
  visit(media: Media): void
}

class SalesReporterVisitor implements ReporterVisitor {
  private sales: { media: Media; date: Date }[] = []

  visit(media: Media) {
    this.sales.push({ media, date: new Date() })
  }

  getReport() {
    return this.sales.map(
      sale => `\n\t${sale.media.name} - ${sale.date.toISOString()}`
    )
  }
}

class ShoppingCart {
  private items: { media: Media; quantity: number }[] = []

  addItem(item: { media: Media; quantity: number }) {
    this.items.push(item)
  }

  sell(visitor: ReporterVisitor) {
    let total = 0
    for (const item of this.items) {
      item.media.accept(visitor)
      total += item.media.cost * item.quantity
    }
    return total
  }
}

export const visitorUseCase: PatternUseCase = (logger: Logger) => () => {
  const matrix = new Movie('The Matrix', 10, 120)
  const darkNight = new Movie('The Dark Knight', 15, 150)
  const superMario = new Game('Super Mario', 20, 'Nintendo Switch')

  const visitor = new SalesReporterVisitor()
  const cart = new ShoppingCart()
  cart.addItem({ media: matrix, quantity: 1 })
  cart.addItem({ media: darkNight, quantity: 1 })
  cart.addItem({ media: superMario, quantity: 2 })

  logger.log(`Shopping cart total: ${cart.sell(visitor)}`)
  logger.log(`Sales report: ${visitor.getReport().join('')}`)
}
