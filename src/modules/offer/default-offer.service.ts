import {inject, injectable} from 'inversify';
import {type OfferDocument, type OfferModel} from './offer.entity.js';
import {type CityName} from '../../types/entities.js';
import {type CreateOfferDto, type OfferService, type UpdateOfferDto} from './offer-service.interface.js';
import {Component} from '../../shared/types/component.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(@inject(Component.OfferModel) private readonly offerModel: OfferModel) {}

  public async find(limit = 60): Promise<OfferDocument[]> {
    return this.offerModel
      .find()
      .sort({publishDate: -1})
      .limit(limit)
      .exec();
  }

  public async findById(id: string): Promise<OfferDocument | null> {
    return this.offerModel.findById(id).exec();
  }

  public async create(dto: CreateOfferDto): Promise<OfferDocument> {
    return this.offerModel.create(dto);
  }

  public async updateById(id: string, dto: UpdateOfferDto): Promise<OfferDocument | null> {
    return this.offerModel.findByIdAndUpdate(id, dto, {new: true}).exec();
  }

  public async deleteById(id: string): Promise<OfferDocument | null> {
    return this.offerModel.findByIdAndDelete(id).exec();
  }

  public async findPremiumByCity(cityName: CityName): Promise<OfferDocument[]> {
    return this.offerModel
      .find({'city.name': cityName, isPremium: true})
      .sort({publishDate: -1})
      .limit(3)
      .exec();
  }

  public async findFavorites(): Promise<OfferDocument[]> {
    return this.offerModel.find({isFavorite: true}).sort({publishDate: -1}).exec();
  }

  public async updateFavoriteStatus(id: string, isFavorite: boolean): Promise<OfferDocument | null> {
    return this.offerModel.findByIdAndUpdate(id, {isFavorite}, {new: true}).exec();
  }

  public async updateCommentsInfo(id: string, commentsCount: number, rating: number): Promise<OfferDocument | null> {
    return this.offerModel.findByIdAndUpdate(id, {commentsCount, rating}, {new: true}).exec();
  }
}
