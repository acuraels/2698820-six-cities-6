import { inject, injectable } from 'inversify';
import { type Config } from '../shared/config/config.interface.js';
import { type DatabaseClient } from '../shared/database/database-client.interface.js';
import { type Logger } from '../shared/libs/logger/logger.interface.js';
import { Component } from '../shared/types/component.js';

@injectable()
export class Application {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config,
    @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClient
  ) { }

  public async init(): Promise<void> {
    const dbUri = `mongodb://${this.config.get('DB_HOST')}:${this.config.get('DB_PORT')}/${this.config.get('DB_NAME')}`;
    await this.databaseClient.connect(dbUri);
    await this.databaseClient.disconnect();

    this.logger.info('Application initialized');
    this.logger.info(`Port: ${this.config.get('PORT')}`);
  }
}
