import { Container } from 'inversify';
import { Application } from '../app/application.js';
import { DefaultCommentService } from '../modules/comment/default-comment.service.js';
import { createCommentModel, type CommentModel } from '../modules/comment/comment.entity.js';
import { type CommentService } from '../modules/comment/comment-service.interface.js';
import { DefaultOfferService } from '../modules/offer/default-offer.service.js';
import { createOfferModel, type OfferModel } from '../modules/offer/offer.entity.js';
import { type OfferService } from '../modules/offer/offer-service.interface.js';
import { DefaultUserService } from '../modules/user/default-user.service.js';
import { createUserModel, type UserModel } from '../modules/user/user.entity.js';
import { type UserService } from '../modules/user/user-service.interface.js';
import { type Config } from './config/config.interface.js';
import { DefaultConfig } from './config/default-config.js';
import { type DatabaseClient } from './database/database-client.interface.js';
import { MongoDatabaseClient } from './database/mongo.database-client.js';
import { type Logger } from './libs/logger/logger.interface.js';
import { PinoLogger } from './libs/logger/pino.logger.js';
import { Component } from './types/component.js';

export const createContainer = (): Container => {
  const container = new Container();

  container.bind<Application>(Component.Application).to(Application).inSingletonScope();
  container.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
  container.bind<Config>(Component.Config).to(DefaultConfig).inSingletonScope();
  container.bind<DatabaseClient>(Component.DatabaseClient).to(MongoDatabaseClient).inSingletonScope();
  container.bind<UserModel>(Component.UserModel).toConstantValue(createUserModel());
  container.bind<OfferModel>(Component.OfferModel).toConstantValue(createOfferModel());
  container.bind<CommentModel>(Component.CommentModel).toConstantValue(createCommentModel());
  container.bind<UserService>(Component.UserService).to(DefaultUserService).inSingletonScope();
  container.bind<OfferService>(Component.OfferService).to(DefaultOfferService).inSingletonScope();
  container.bind<CommentService>(Component.CommentService).to(DefaultCommentService).inSingletonScope();

  return container;
};
