import { access, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { PatternUseCase } from '../../types'
import type { Logger } from '../creational/factory'

export class FileManagerFacade {
  constructor(private readonly logger: Logger) {}

  async createDirectory(path: string) {
    return this.runner(async () => {
      const accessed = await access(path).catch(() => false)
      if (!accessed) await mkdir(path, { recursive: true })
    })
  }

  async pathExists(path: string) {
    return this.runner(async () => {
      const accessed = await access(path).catch(() => false)
      return accessed !== false
    })
  }

  async readFile(path: string, exception?: Error) {
    return this.runner(async () => {
      const fileExists = await access(path).catch(() => false)
      if (fileExists !== false) {
        const file = await readFile(path)
        return file
      } else if (exception) throw exception
      else return null
    })
  }

  async deleteDirectory(path: string) {
    return this.runner(async () => {
      const fileExists = await access(path).catch(() => false)
      if (fileExists !== false) await rm(path, { recursive: true })
    })
  }

  async getFileSize(path: string) {
    return this.runner(async () => {
      const statResult = await stat(path)
      return statResult.size
    })
  }

  async createFile({
    path,
    content,
    fileName,
    encoding
  }: {
    path: string
    content: Buffer | string
    fileName?: string
    encoding?: BufferEncoding
  }) {
    return this.runner(async () => {
      const filePath = join(path, fileName ?? '')
      await writeFile(content, filePath, encoding)
    })
  }

  private async runner<T>(work: () => Promise<T>) {
    try {
      const result = await work()
      return result
    } catch (error) {
      this.logger.error(`Error in FileManagerService: ${error}`)
      process.exit(1)
    }
  }
}

export const facadeUseCase: PatternUseCase = (logger: Logger) => async () => {
  const fileManager = new FileManagerFacade(logger)
  const packageJsonPath = join(process.cwd(), 'package.json')

  const [packageJsonContent, packageJsonSize] = await Promise.all([
    fileManager.readFile(packageJsonPath),
    fileManager.getFileSize(packageJsonPath)
  ])
  logger.log(`Package.json content: ${packageJsonContent}`)
  logger.log(`Package.json size: ${packageJsonSize}`)
}
