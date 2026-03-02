import {inject, injectable} from 'inversify';
import mongoose from 'mongoose';
import {type Logger} from '../libs/logger/logger.interface.js';
import {Component} from '../types/component.js';
import {type DatabaseClient} from './database-client.interface.js';

@injectable()
export class MongoDatabaseClient implements DatabaseClient {
  constructor(@inject(Component.Logger) private readonly logger: Logger) {}

  public async connect(uri: string): Promise<void> {
    this.logger.info(`Trying to connect to database: ${uri}`);
    await mongoose.connect(uri);
    this.logger.info('Database connection established');
  }

  public async disconnect(): Promise<void> {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      this.logger.info('Database connection closed');
    }
  }
}
