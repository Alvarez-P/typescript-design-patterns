import type { PatternRunner } from '../../types'
import { Course, CourseBuilder } from './builder'
import type { Logger } from './factory'

export class CoursePrototype {
  constructor(public courseBuilder: CourseBuilder) {}

  clone(): CourseBuilder {
    return new CourseBuilder(this.courseBuilder.build())
  }
}

export const prototypeRunner: PatternRunner = (logger: Logger) => () => {
  const baseCourse = new Course(
    'Design Patterns in TypeScript',
    'Learn how to implement design patterns in TypeScript',
    30,
    99.99,
    'John Doe',
    ['Programming', 'TypeScript'],
    ['Basic TypeScript knowledge'],
    [],
    ['Singleton', 'Factory', 'Builder', 'Prototype'],
    new Date('2025-09-01'),
    new Date(),
    new Date(),
    null
  )

  const prototype = new CoursePrototype(new CourseBuilder(baseCourse))
  const clonedCourse = prototype.clone()
  clonedCourse.setTitle('Advanced Design Patterns in TypeScript')

  logger.log(`Original Course: ${baseCourse.title}`)
  logger.log(`Cloned Course: ${clonedCourse.build().title}`)
}
