import {Expose, Type} from 'class-transformer';
import {UserRdo} from '../../user/rdo/user.rdo.js';
import {OfferSummaryRdo} from './offer-summary.rdo.js';

export class OfferDetailRdo extends OfferSummaryRdo {
  @Expose()
  public description!: string;

  @Expose()
  public images!: string[];

  @Expose()
  public roomsCount!: number;

  @Expose()
  public guestsCount!: number;

  @Expose()
  public amenities!: string[];

  @Expose({name: 'authorId'})
  @Type(() => UserRdo)
  public author!: UserRdo;
}
