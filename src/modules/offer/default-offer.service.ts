import {inject, injectable} from 'inversify';
import {type OfferDocument, type OfferModel} from './offer.entity.js';
import {type CreateOfferDto, type OfferService} from './offer-service.interface.js';
import {Component} from '../../shared/types/component.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(@inject(Component.OfferModel) private readonly offerModel: OfferModel) {}

  public async findById(id: string): Promise<OfferDocument | null> {
    return this.offerModel.findById(id).exec();
  }

  public async create(dto: CreateOfferDto): Promise<OfferDocument> {
    return this.offerModel.create(dto);
  }
}
