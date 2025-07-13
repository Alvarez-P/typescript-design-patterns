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

class Inventory {
  private products: { [key: string]: Product } = {}
  constructor(public id: string) {}

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

  getId(): string {
    return this.id
  }
}

class InventoryManager {
  private inventories: { [key: string]: Inventory } = {}

  getInventory(id: string): Inventory {
    if (!this.inventories[id]) this.inventories[id] = new Inventory(id)
    return this.inventories[id]
  }
}

export const flyweightUseCase: PatternUseCase = (logger: Logger) => () => {
  const dummyInventories = ['Inventory-1', 'Inventory-2']
  const randomQuantity = () => Math.floor(Math.random() * 5) + 1

  const manager = new InventoryManager()
  for (const inventoryKey of dummyInventories) {
    const inventory = manager.getInventory(inventoryKey)
    inventory
      .addProduct({ name: 'Product A', price: 10, quantity: randomQuantity() })
      .addProduct({ name: 'Product B', price: 15, quantity: randomQuantity() })
    logger.log(`${inventory.getId()} products: ${inventory.getProducts()}`)
    logger.log(`${inventory.getId()} total cost: $${inventory.totalCost()}`)
  }
}
