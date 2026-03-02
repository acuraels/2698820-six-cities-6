export const Component = {
  Application: Symbol('Application'),
  Logger: Symbol('Logger'),
  Config: Symbol('Config'),
  DatabaseClient: Symbol('DatabaseClient'),
  UserModel: Symbol('UserModel'),
  OfferModel: Symbol('OfferModel'),
  UserService: Symbol('UserService'),
  OfferService: Symbol('OfferService')
} as const;
