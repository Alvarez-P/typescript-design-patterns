class Course {
	constructor(
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

	addCategory(category: string): this {
		this.course.categories.push(category)
		return this
	}

	addRequirement(requirement: string): this {
		this.course.requirements.push(requirement)
		return this
	}

	addTopic(topic: string): this {
		this.course.topics.push(topic)
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
		return result
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

	clone(): CourseBuilder {
		return new CourseBuilder(this.course)
	}
}
