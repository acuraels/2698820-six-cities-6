import {type Types} from 'mongoose';
import {type CrudService} from '../../shared/types/crud-service.interface.js';
import {type CityName} from '../../types/entities.js';
import {type OfferDocument, type OfferEntity} from './offer.entity.js';

export type CreateOfferDto = Omit<OfferEntity, 'createdAt' | 'updatedAt' | 'favoriteUserIds' | 'authorId'> & {
  authorId: Types.ObjectId | string;
  favoriteUserIds?: Array<Types.ObjectId | string>;
};
export type UpdateOfferDto = Partial<Omit<CreateOfferDto, 'authorId' | 'commentsCount' | 'rating' | 'favoriteUserIds'>>;

export interface OfferService extends CrudService<OfferDocument, CreateOfferDto> {
  find(limit?: number, userId?: string): Promise<OfferDocument[]>;
  findById(id: string, userId?: string): Promise<OfferDocument | null>;
  updateById(id: string, dto: UpdateOfferDto, userId?: string): Promise<OfferDocument | null>;
  deleteById(id: string): Promise<OfferDocument | null>;
  findPremiumByCity(cityName: CityName, userId?: string): Promise<OfferDocument[]>;
  findFavorites(userId: string): Promise<OfferDocument[]>;
  updateFavoriteStatus(id: string, userId: string, isFavorite: boolean): Promise<OfferDocument | null>;
  updateCommentsInfo(id: string, commentsCount: number, rating: number): Promise<OfferDocument | null>;
}
