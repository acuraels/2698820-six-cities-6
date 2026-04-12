import {instanceToPlain} from 'class-transformer';
import {Types} from 'mongoose';
import {type Request, type Response} from 'express';
import {inject, injectable} from 'inversify';
import {type CommentService, type CreateCommentDto as CreateCommentServiceDto} from './comment-service.interface.js';
import {CreateCommentDto} from './dto/create-comment.dto.js';
import {CommentRdo} from './rdo/comment.rdo.js';
import {type OfferService} from '../offer/offer-service.interface.js';
import {fillDTO} from '../../shared/helpers/common.js';
import {type Logger} from '../../shared/libs/logger/logger.interface.js';
import {DocumentExistsMiddleware} from '../../shared/middleware/document-exists.middleware.js';
import {ParseObjectIdMiddleware} from '../../shared/middleware/parse-objectid.middleware.js';
import {PrivateRouteMiddleware} from '../../shared/middleware/private-route.middleware.js';
import {ValidateDtoMiddleware} from '../../shared/middleware/validate-dto.middleware.js';
import {Controller} from '../../shared/rest/controller.abstract.js';
import {type TokenService} from '../../shared/token/token-service.interface.js';
import {Component} from '../../shared/types/component.js';

type OfferIdParams = {offerId: string};

@injectable()
export class CommentController extends Controller {
  constructor(
    @inject(Component.Logger) logger: Logger,
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.TokenService) private readonly tokenService: TokenService
  ) {
    super(logger, {mergeParams: true});

    const offerIdMiddleware = new ParseObjectIdMiddleware('offerId');
    const offerExistsMiddleware = new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId', 'offer');
    const privateRouteMiddleware = new PrivateRouteMiddleware(this.tokenService);

    this.addRoute({path: '/', method: 'get', handler: this.index, middlewares: [offerIdMiddleware, offerExistsMiddleware]});
    this.addRoute({
      path: '/',
      method: 'post',
      handler: this.create,
      middlewares: [offerIdMiddleware, new ValidateDtoMiddleware(CreateCommentDto), privateRouteMiddleware, offerExistsMiddleware]
    });
  }

  public index = async ({params}: Request<OfferIdParams>, response: Response): Promise<void> => {
    const comments = await this.commentService.findByOfferId(params.offerId);
    this.ok(response, instanceToPlain(fillDTO(CommentRdo, comments)));
  };

  public create = async ({body}: Request<OfferIdParams, object, CreateCommentDto>, response: Response): Promise<void> => {
    const offer = response.locals.offer;
    const dto = body as CreateCommentDto;

    const serviceDto: CreateCommentServiceDto = {
      text: dto.text,
      rating: dto.rating,
      offerId: offer._id,
      authorId: new Types.ObjectId(response.locals.userId as string)
    };

    const comment = await this.commentService.create(serviceDto);
    this.created(response, instanceToPlain(fillDTO(CommentRdo, comment)));
  };
}
