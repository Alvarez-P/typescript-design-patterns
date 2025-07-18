import type { PatternUseCase } from '../../types'
import type { Logger } from '../creational/factory'

interface State {
  order: Order

  cancelOrder(): void
  verifyPayment(): void
  shipOrder(): void
}

class Order {
  public cancelledOrderState: State
  public paymentPendingState: State
  public orderShippedState: State
  public orderBeingPrepared: State

  public currentState: State

  constructor(logger: Logger, initialState?: State) {
    this.cancelledOrderState = new CancelledOrderState(this, logger)
    this.paymentPendingState = new PaymentPendingState(this, logger)
    this.orderShippedState = new OrderShippedState(this, logger)
    this.orderBeingPrepared = new OrderBeingPrepared(this, logger)

    this.currentState = initialState ?? this.paymentPendingState
  }
  public setState(state: State) {
    this.currentState = state
  }
  public getCurrentState(): State {
    return this.currentState
  }
}

class CancelledOrderState implements State {
  constructor(
    public order: Order,
    private logger: Logger
  ) {}

  public cancelOrder() {
    this.logger.log('This order is already cancelled')
    this.order.setState(this.order.cancelledOrderState)
  }
  public verifyPayment() {
    this.logger.log('The order is cancelled, you cannot pay anymore.')
  }
  public shipOrder() {
    this.logger.log('The order is cancelled, you cannot ship it anymore.')
  }
}

class PaymentPendingState implements State {
  constructor(
    public order: Order,
    private logger: Logger
  ) {}

  cancelOrder() {
    this.logger.log('Cancelling your unpaid order...')
    this.order.setState(this.order.cancelledOrderState)
  }
  verifyPayment() {
    this.logger.log('Payment verified! Shipping soon.')
    this.order.setState(this.order.orderBeingPrepared)
  }
  shipOrder() {
    this.logger.log('Cannot ship order when payment is pending!')
  }
}

class OrderBeingPrepared implements State {
  constructor(
    public order: Order,
    private logger: Logger
  ) {}

  cancelOrder() {
    this.logger.log('Cancelling your order.. You will be refunded.')
    this.order.setState(this.order.cancelledOrderState)
  }
  verifyPayment() {
    this.logger.log('Payment is already verified.')
  }
  shipOrder() {
    this.logger.log('Shipping your order now..')
    this.order.setState(this.order.orderShippedState)
  }
}

class OrderShippedState implements State {
  constructor(
    public order: Order,
    private logger: Logger
  ) {}

  cancelOrder() {
    this.logger.log('You cannot cancel an order that has been shipped.')
  }
  verifyPayment() {
    this.logger.log('Payment is already verified')
  }
  shipOrder() {
    this.logger.log('Order is already shipped')
  }
}

export const stateUseCase: PatternUseCase = (logger: Logger) => () => {
  const order = new Order(logger)

  order.getCurrentState().verifyPayment()
  order.getCurrentState().shipOrder()
  order.getCurrentState().cancelOrder()

  logger.log(`Order state: ${(order.getCurrentState()).constructor.name}`)
}
