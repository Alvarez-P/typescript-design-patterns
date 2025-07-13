import type { PatternUseCase } from '../../types'
import type { Logger } from '../creational/factory'

class User {
  constructor(
    public id: string,
    public name: string,
    public age: number,
    public email: string
  ) {}
}

class UserRepository {
  private users: Map<string, User> = new Map()

  save(user: Omit<User, 'id'>) {
    const id = crypto.randomUUID()
    this.users.set(id, new User(id, user.name, user.age, user.email))
    return id
  }

  getById(id: string) {
    return this.users.get(id) ?? null
  }
}

class UserRepositoryProxy {
  private cachingExpirationTime = 1000
  private cachedUsers: Map<string, User> = new Map()
  constructor(
    private repository: UserRepository,
    private logger: Logger
  ) {}

  save(user: Omit<User, 'id'>): [string[], null] | [null, { id: string }] {
    const errors: string[] = []
    const emailRegex = new RegExp(
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
    )
    if (user.age < 18) errors.push('User is too young')
    if (!emailRegex.test(user.email)) errors.push('Invalid email')
    if (errors.length) return [errors, null]
    return [null, { id: this.repository.save(user) }]
  }

  getById(id: string) {
    const isCached = this.cachedUsers.get(id)
    if (isCached) {
      this.logger.log(`Getting user from cache: ${id}`)
      return isCached
    }
    const user = this.repository.getById(id)
    if (!user) return null
    this.cachedUsers.set(id, user)
    setTimeout(() => this.cachedUsers.delete(id), this.cachingExpirationTime)
    return user
  }
}

export const proxyUseCase: PatternUseCase = (logger: Logger) => () => {
  const userRepository = new UserRepository()
  const userRepositoryProxy = new UserRepositoryProxy(userRepository, logger)
  const userWithError = userRepositoryProxy.save({
    name: 'John Doe',
    age: 15,
    email: 'invalid@email'
  })
  const correctUser = userRepositoryProxy.save({
    name: 'Jane Doe',
    age: 20,
    email: 'jane@example.com'
  })

  logger.log(`User with errors: ${JSON.stringify(userWithError[0])}`)
  logger.log(`Correct user: ${JSON.stringify(correctUser[1])}`)

  const createdUser = correctUser[1]
  if (!createdUser) return
  userRepositoryProxy.getById(createdUser.id)
  userRepositoryProxy.getById(createdUser.id)
}
