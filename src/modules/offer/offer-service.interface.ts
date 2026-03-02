import {type CrudService} from '../../shared/types/crud-service.interface.js';
import {type OfferDocument, type OfferEntity} from './offer.entity.js';

export type CreateOfferDto = Omit<OfferEntity, 'createdAt' | 'updatedAt'>;

export interface OfferService extends CrudService<OfferDocument, CreateOfferDto> {}
