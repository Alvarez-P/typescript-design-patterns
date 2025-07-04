import {
	ConsoleLogger,
	DatadogLogger,
	FileLogger,
	type Logger
} from './factory'

interface ApiSettings {
	database: {
		host: string
		port: number
		user: string
		pwd: string
	}
	aws: {
		accessKeyId: string
		secretAccessKey: string
	}
	port: number
}

export abstract class EnvironmentApiSettingsFactory {
	abstract createLogger(target: string): Logger
	abstract createSettings(): ApiSettings
}

export class DevelopmentApiSettingsFactory extends EnvironmentApiSettingsFactory {
	createLogger(target: string): Logger {
		return new ConsoleLogger(target)
	}

	createSettings(): ApiSettings {
		return {
			database: {
				host: 'localhost',
				port: 5432,
				user: 'dev_user',
				pwd: 'dev_password'
			},
			aws: {
				accessKeyId: 'dev_access_key',
				secretAccessKey: 'dev_secret_key'
			},
			port: 3000
		}
	}
}

export class ProductionApiSettingsFactory extends EnvironmentApiSettingsFactory {
	createLogger(target: string): Logger {
		return new DatadogLogger(target)
	}

	createSettings(): ApiSettings {
		return {
			database: {
				host: 'prod-db.example.com',
				port: 5432,
				user: 'prod_user',
				pwd: 'prod_password'
			},
			aws: {
				accessKeyId: 'prod_access_key',
				secretAccessKey: 'prod_secret_key'
			},
			port: 3000
		}
	}
}

export class TestingApiSettingsFactory extends EnvironmentApiSettingsFactory {
	createLogger(target: string): Logger {
		return new ConsoleLogger(target)
	}

	createSettings(): ApiSettings {
		return {
			database: {
				host: 'localhost',
				port: 5432,
				user: 'test_user',
				pwd: 'test_password'
			},
			aws: {
				accessKeyId: 'test_access_key',
				secretAccessKey: 'test_secret_key'
			},
			port: 3000
		}
	}
}

export class QAApiSettingsFactory extends EnvironmentApiSettingsFactory {
	createLogger(target: string): Logger {
		return new FileLogger(target)
	}

	createSettings(): ApiSettings {
		return {
			database: {
				host: 'qa-db.example.com',
				port: 5432,
				user: 'qa_user',
				pwd: 'qa_password'
			},
			aws: {
				accessKeyId: 'qa_access_key',
				secretAccessKey: 'qa_secret_key'
			},
			port: 3000
		}
	}
}
