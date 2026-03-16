import {type CrudService} from '../../shared/types/crud-service.interface.js';
import {type CityName} from '../../types/entities.js';
import {type OfferDocument, type OfferEntity} from './offer.entity.js';

export type CreateOfferDto = Omit<OfferEntity, 'createdAt' | 'updatedAt'>;
export type UpdateOfferDto = Partial<Omit<CreateOfferDto, 'authorId' | 'commentsCount' | 'rating'>>;

export interface OfferService extends CrudService<OfferDocument, CreateOfferDto> {
  find(limit?: number): Promise<OfferDocument[]>;
  updateById(id: string, dto: UpdateOfferDto): Promise<OfferDocument | null>;
  deleteById(id: string): Promise<OfferDocument | null>;
  findPremiumByCity(cityName: CityName): Promise<OfferDocument[]>;
  findFavorites(): Promise<OfferDocument[]>;
  updateFavoriteStatus(id: string, isFavorite: boolean): Promise<OfferDocument | null>;
  updateCommentsInfo(id: string, commentsCount: number, rating: number): Promise<OfferDocument | null>;
}
