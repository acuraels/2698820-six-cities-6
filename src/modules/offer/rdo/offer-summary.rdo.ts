import {Expose} from 'class-transformer';

export class OfferSummaryRdo {
  @Expose({name: '_id'})
  public id!: string;

  @Expose()
  public title!: string;

  @Expose()
  public rentalPrice!: number;

  @Expose()
  public housingType!: string;

  @Expose()
  public publishDate!: Date;

  @Expose()
  public city!: object;

  @Expose()
  public previewImage!: string;

  @Expose()
  public isPremium!: boolean;

  @Expose()
  public isFavorite!: boolean;

  @Expose()
  public rating!: number;

  @Expose()
  public commentsCount!: number;
}
