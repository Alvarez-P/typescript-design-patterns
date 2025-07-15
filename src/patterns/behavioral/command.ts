import { access, readFile, unlink, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { PatternUseCase } from '../../types'
import type { Logger } from '../creational/factory'

interface Command {
  execute(): void | Promise<void>
  undo(): void | Promise<void>
}

class CreateFileCommand implements Command {
  constructor(
    public file: {
      path: string
      content: string
      encoding?: BufferEncoding
    },
    private logger: Logger
  ) {}

  async execute() {
    await writeFile(this.file.path, this.file.content, this.file.encoding)
    this.logger.log(`File created: ${this.file.path}`)
  }

  async undo() {
    const fileExists = await access(this.file.path).catch(() => false)
    if (fileExists !== false) await unlink(this.file.path)
    this.logger.log(`File deleted: ${this.file.path}`)
  }

  redo() {
    return this.execute()
  }
}

class ReadFileCommand implements Command {
  constructor(
    public filePath: string,
    private logger: Logger
  ) {}

  async execute() {
    const file = await readFile(this.filePath)
    this.logger.log(`File content: ${file}`)
  }

  undo() {}
}

class CommandManager {
  private executed: Command[] = []

  constructor(private logger: Logger) {}

  async execute(command: Command) {
    try {
      const r = command.execute()
      if (r instanceof Promise) await r
      this.executed.push(command)
    } catch (error) {
      this.logger.error(`Error executing command: ${error}.`)
    }
  }

  async undo() {
    for (const c of this.executed) {
      try {
        const r = c.undo()
        if (r instanceof Promise) await r
      } catch (error) {
        this.logger.error(`Error executing command: ${error}`)
      }
    }
  }

  clear() {
    this.executed = []
  }
}

export const commandUseCase: PatternUseCase = (logger: Logger) => async () => {
  const commandManager = new CommandManager(logger)

  const path: string = join(process.cwd(), 'file.json')
  const content: string = JSON.stringify({ name: 'John Doe' })

  try {
    const createFileCommand = new CreateFileCommand({ path, content }, logger)
    await commandManager.execute(createFileCommand)

    const readFileCommand = new ReadFileCommand(path, logger)
    await commandManager.execute(readFileCommand)

    throw 'Sample error'
  } catch (_) {
    await commandManager.undo()
  } finally {
    commandManager.clear()
  }
}
