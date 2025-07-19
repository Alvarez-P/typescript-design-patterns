import type { PatternUseCase } from '../../types'
import type { Logger } from '../creational/factory'

interface EmailGenerator<T extends Record<string, unknown>> {
  generate(data: T): string
}

abstract class EmailTemplate<T extends Record<string, unknown>>
  implements EmailGenerator<T>
{
  protected header(): string {
    return '<h1>Design Patterns in TypeScript Course</h1>\n\t<h3>Learn how to implement design patterns in TypeScript</h3>'
  }
  protected abstract body(data: T): string
  protected footer(): string {
    return '<footer>Contact us for more information</footer>'
  }

  public generate(data: T): string {
    const header = this.header()
    const body = this.body(data)
    const footer = this.footer()
    return `\n\t${header}\n\t${body}\n\t${footer}`
  }
}

class InscriptionEmail extends EmailTemplate<{ name: string }> {
  protected body(data: { name: string }): string {
    return `<p>Welcome ${data.name}. You have been successfully registered</p>`
  }
}

export const templateUseCase: PatternUseCase = (logger: Logger) => () => {
  const inscriptionEmail = new InscriptionEmail()
  logger.log(inscriptionEmail.generate({ name: 'John Doe' }))
}
