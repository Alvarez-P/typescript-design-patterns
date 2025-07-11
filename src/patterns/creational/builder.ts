import type { PatternUseCase } from '../../types'
import type { Logger } from './factory'

export class Course {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public duration: number,
    public price: number,
    public instructor: string,
    public categories: string[],
    public requirements: string[],
    public enrolled: string[],
    public topics: string[],
    public startAt: Date,
    public createdAt: Date,
    public updatedAt: Date,
    public deletedAt: Date | null
  ) {}
}

export class CourseBuilder {
  private course: Course

  constructor(course?: Course) {
    this.course = course
      ? new Course(
          course.id,
          course.title,
          course.description,
          course.duration,
          course.price,
          course.instructor,
          [...course.categories],
          [...course.requirements],
          [...course.topics],
          [...course.enrolled],
          new Date(course.startAt),
          new Date(course.createdAt),
          new Date(course.updatedAt),
          course.deletedAt
        )
      : this.init()
  }

  private init() {
    return new Course(
      crypto.randomUUID(),
      '',
      '',
      0,
      0,
      '',
      [],
      [],
      [],
      [],
      new Date(),
      new Date(),
      new Date(),
      null
    )
  }

  id(id: string): this {
    this.course.id = id
    return this
  }

  setTitle(title: string): this {
    this.course.title = title
    return this
  }

  setDescription(description: string): this {
    this.course.description = description
    return this
  }

  setDuration(duration: number): this {
    this.course.duration = duration
    return this
  }

  setPrice(price: number): this {
    this.course.price = price
    return this
  }

  setInstructor(instructor: string): this {
    this.course.instructor = instructor
    return this
  }

  addCategory(...category: string[]): this {
    this.course.categories.push(...category)
    return this
  }

  addRequirement(...requirement: string[]): this {
    this.course.requirements.push(...requirement)
    return this
  }

  addTopic(...topic: string[]): this {
    this.course.topics.push(...topic)
    return this
  }

  addEnrollment(...enrolled: string[]): this {
    this.course.enrolled.push(...enrolled)
    return this
  }

  setStartAt(startAt: Date): this {
    this.course.startAt = startAt
    return this
  }

  setCreatedAt(createdAt: Date): this {
    this.course.createdAt = createdAt
    return this
  }

  setUpdatedAt(updatedAt: Date): this {
    this.course.updatedAt = updatedAt
    return this
  }

  setDeletedAt(deletedAt: Date | null): this {
    this.course.deletedAt = deletedAt
    return this
  }

  build(): Course {
    const result = { ...this.course }
    this.reset()
    return new Course(
      result.id,
      result.title,
      result.description,
      result.duration,
      result.price,
      result.instructor,
      [...result.categories],
      [...result.requirements],
      [...result.enrolled],
      [...result.topics],
      result.startAt,
      result.createdAt,
      result.updatedAt,
      result.deletedAt
    )
  }

  excludeAndBuild<ToExclude extends (keyof Course)[]>(
    exclude: ToExclude
  ): Omit<Course, ToExclude[number]> {
    const course = { ...this.course }
    for (const key of exclude) delete course[key]
    return course
  }

  reset(): this {
    this.course = this.init()
    return this
  }
}

export const builderUseCase: PatternUseCase = (logger: Logger) => () => {
  const courseBuilder = new CourseBuilder()
    .setTitle('Design Patterns in TypeScript')
    .setDescription('Learn how to implement design patterns in TypeScript')
    .setDuration(30)
    .setPrice(99.99)
    .setInstructor('John Doe')
    .addCategory('Programming', 'TypeScript')
    .addRequirement('Basic TypeScript knowledge')
    .addTopic('Singleton', 'Factory', 'Builder', 'Prototype')
    .setStartAt(new Date('2025-09-01'))
    .setCreatedAt(new Date())
    .setUpdatedAt(new Date())
    .setDeletedAt(null)

  const course = courseBuilder.build()
  const courseDataToFlyer = courseBuilder.excludeAndBuild([
    'description',
    'enrolled',
    'requirements',
    'categories',
    'topics',
    'createdAt',
    'updatedAt',
    'deletedAt'
  ])

  logger.log(`Course ${course.title} imparted by ${course.instructor}`)
  logger.log(
    `Builded data is instance of Course? ${course instanceof Course ? '✅' : '❌'}`
  )
  logger.log(`Course data for flyer: ${Object.keys(courseDataToFlyer)}`)
}
