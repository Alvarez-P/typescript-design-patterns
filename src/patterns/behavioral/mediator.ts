import type { PatternUseCase } from '../../types'
import type { Logger } from '../creational/factory'

class Sender {
  constructor(
    private name: string,
    private chatRoom: ChatRoom
  ) {}

  getName() {
    return this.name
  }

  send(message: string) {
    this.chatRoom.addMessage(this, message)
  }
}

class ChatRoom {
  private history: { [date: string]: string[] } = {}

  addMessage(sender: Sender, message: string) {
    const now = new Date()
    const date = now.toDateString()
    const time = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
    if (!this.history[date]) this.history[date] = []
    this.history[date].push(`[${time}] ${sender.getName()}: ${message}`)
  }

  showHistory() {
    return Object.entries(this.history)
      .map(([date, messages]) => {
        return `\n\t${date}\n\t${messages.join('\n\t')}`
      })
      .join('\n')
      .trimEnd()
  }
}

export const mediatorUseCase: PatternUseCase = (logger: Logger) => () => {
  const chatRoom = new ChatRoom()
  const ana = new Sender('Ana', chatRoom)
  const bob = new Sender('Bob', chatRoom)
  const bot = new Sender('ChatBot', chatRoom)

  ana.send('Hello!')
  bob.send('Hi!')
  bot.send('Welcome to the chat room!')
  logger.log(chatRoom.showHistory())
}
