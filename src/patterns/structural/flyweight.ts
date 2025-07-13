import type { PatternUseCase } from '../../types'
import type { Logger } from './../creational/factory'

class Product {
  constructor(
    public name: string,
    public price: number,
    public quantity: number
  ) {}

  cost(): number {
    return this.price * this.quantity
  }
}

class ShoppingCart {
  private products: { [key: string]: Product } = {}

  addProduct({
    name,
    price,
    quantity
  }: {
    name: string
    price: number
    quantity: number
  }) {
    this.products[name] = new Product(
      name,
      price,
      (this.products[name]?.quantity ?? 0) + quantity
    )
    return this
  }

  totalCost(): number {
    return Object.values(this.products).reduce((acc, p) => acc + p.cost(), 0)
  }

  getProducts(): string {
    return Object.values(this.products).reduce(
      (acc, p) => `${acc}\n\t${p.name} - $${p.cost()}`,
      ''
    )
  }

  sell(): void {
    this.products = {}
  }
}

export const flyweightUseCase: PatternUseCase = (logger: Logger) => () => {
  const cart = new ShoppingCart()
    .addProduct({
      name: 'Product A',
      price: 10,
      quantity: 2
    })
    .addProduct({
      name: 'Product B',
      price: 20,
      quantity: 3
    })
    .addProduct({
      name: 'Product C',
      price: 30,
      quantity: 1
    })
  logger.log(`Products in cart: ${cart.getProducts()}`)
  logger.log(`Selling products. Total cost: $${cart.totalCost()}`)
  cart.sell()
}
