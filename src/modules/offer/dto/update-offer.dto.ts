import {type Amenity, type CityName, type HousingType, type Location} from '../../../types/entities.js';

export class UpdateOfferDto {
  public title?: string;
  public description?: string;
  public city?: CityName;
  public previewImage?: string;
  public images?: [string, string, string, string, string, string];
  public isPremium?: boolean;
  public housingType?: HousingType;
  public roomsCount?: number;
  public guestsCount?: number;
  public rentalPrice?: number;
  public amenities?: Amenity[];
  public coordinates?: Location;
}
