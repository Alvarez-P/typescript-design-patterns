import type { PatternUseCase } from '../../types'
import type { Logger } from '../creational/factory'

class Account {
  private successor: Account | null = null

  constructor(
    public name: string,
    public balance: number
  ) {}

  setNext(account: Account) {
    this.successor = account
  }

  pay(amountToPay: number): string {
    if (this.canPay(amountToPay)) {
      this.balance -= amountToPay
      return `\n\tPaid ${amountToPay} using ${this.name}`
    }
    if (this.successor)
      return `\n\tCannot pay using ${this.name}. Trying next...\t${this.successor.pay(amountToPay)}`
    return `\n\tNone of the accounts have enough balance to pay ${amountToPay}`
  }

  canPay(amount: number) {
    return this.balance >= amount
  }
}

class Bank extends Account {
  constructor(balance: number) {
    super('bank', balance)
  }
}

class Paypal extends Account {
  constructor(balance: number) {
    super('paypal', balance)
  }
}

class Bitcoin extends Account {
  constructor(balance: number) {
    super('bitcoin', balance)
  }
}

export const chainOfResponsibilityUseCase: PatternUseCase =
  (logger: Logger) => () => {
    const bank = new Bank(100)
    const paypal = new Paypal(200)
    const bitcoin = new Bitcoin(300)

    bank.setNext(paypal)
    paypal.setNext(bitcoin)

    logger.log(bank.pay(259))
    logger.log(bank.pay(310))
  }
