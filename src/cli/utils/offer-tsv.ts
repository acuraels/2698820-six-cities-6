import { AMENITIES, CITY_NAMES, type CityName, type HousingType, HOUSING_TYPES, type Offer, type UserType, USER_TYPES } from '../../types/entities.js';
import { CITY_LOCATION, RATING_PRECISION, TSV_COLUMNS_COUNT } from '../constants.js';
import { type MockServerData } from '../types.js';
import { getRandomArrayItem, getRandomDate, getRandomFloat, getRandomInt, getRandomSubset } from './random.js';

const parseBoolean = (value: string, fieldName: string): boolean => {
  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  throw new Error(`Поле "${fieldName}" должно быть true или false`);
};

const parseEnumValue = <T extends string>(value: string, validValues: readonly T[], fieldName: string): T => {
  if (validValues.includes(value as T)) {
    return value as T;
  }

  throw new Error(`Недопустимое значение поля "${fieldName}": ${value}`);
};

const parseNumber = (value: string, fieldName: string): number => {
  const parsedValue = Number(value);

  if (Number.isNaN(parsedValue)) {
    throw new Error(`Поле "${fieldName}" должно быть числом`);
  }

  return parsedValue;
};

export const parseOfferLine = (line: string, lineNumber: number): Offer => {
  const columns = line.split('\t');

  if (columns.length !== TSV_COLUMNS_COUNT) {
    throw new Error(`Строка ${lineNumber}: ожидается ${TSV_COLUMNS_COUNT} полей, получено ${columns.length}`);
  }

  const [
    title,
    description,
    publishDate,
    cityName,
    previewImage,
    imagesRaw,
    isPremiumRaw,
    isFavoriteRaw,
    ratingRaw,
    housingTypeRaw,
    roomsCountRaw,
    guestsCountRaw,
    rentalPriceRaw,
    amenitiesRaw,
    userName,
    userEmail,
    userTypeRaw,
    latitudeRaw,
    longitudeRaw
  ] = columns;

  const images = imagesRaw.split(';');
  if (images.length !== 6) {
    throw new Error(`Строка ${lineNumber}: поле "images" должно содержать ровно 6 ссылок`);
  }

  const amenities = amenitiesRaw.split(';');
  if (amenities.length === 0) {
    throw new Error(`Строка ${lineNumber}: поле "amenities" не может быть пустым`);
  }

  const validatedAmenities = amenities.map((amenity) => parseEnumValue(amenity, AMENITIES, 'amenities'));
  const city = parseEnumValue(cityName, CITY_NAMES, 'city') as CityName;
  const housingType = parseEnumValue(housingTypeRaw, HOUSING_TYPES, 'housingType') as HousingType;
  const userType = parseEnumValue(userTypeRaw, USER_TYPES, 'userType') as UserType;

  return {
    title,
    description,
    publishDate: new Date(publishDate).toISOString(),
    city: {
      name: city,
      location: {
        latitude: parseNumber(latitudeRaw, 'latitude'),
        longitude: parseNumber(longitudeRaw, 'longitude')
      }
    },
    previewImage,
    images: images as Offer['images'],
    isPremium: parseBoolean(isPremiumRaw, 'isPremium'),
    isFavorite: parseBoolean(isFavoriteRaw, 'isFavorite'),
    rating: parseNumber(ratingRaw, 'rating'),
    housingType,
    roomsCount: parseNumber(roomsCountRaw, 'roomsCount'),
    guestsCount: parseNumber(guestsCountRaw, 'guestsCount'),
    rentalPrice: parseNumber(rentalPriceRaw, 'rentalPrice'),
    amenities: validatedAmenities,
    author: {
      name: userName,
      email: userEmail,
      userType
    },
    commentsCount: 0
  };
};

export const createOfferTsvRow = (mockData: MockServerData): string => {
  const city = getRandomArrayItem(CITY_NAMES);
  const cityLocation = CITY_LOCATION[city];
  const images = getRandomSubset(mockData.images, 6, 6);
  const amenities = getRandomSubset(AMENITIES, 1, AMENITIES.length);

  const offer: Offer = {
    title: getRandomArrayItem(mockData.titles),
    description: getRandomArrayItem(mockData.descriptions),
    publishDate: getRandomDate(),
    city: {
      name: city,
      location: cityLocation
    },
    previewImage: getRandomArrayItem(mockData.previewImages),
    images: images as Offer['images'],
    isPremium: Math.random() > 0.5,
    isFavorite: Math.random() > 0.5,
    rating: getRandomFloat(1, 5, RATING_PRECISION),
    housingType: getRandomArrayItem(HOUSING_TYPES),
    roomsCount: getRandomInt(1, 8),
    guestsCount: getRandomInt(1, 10),
    rentalPrice: getRandomInt(100, 100_000),
    amenities,
    author: {
      name: getRandomArrayItem(mockData.userNames),
      email: getRandomArrayItem(mockData.userEmails),
      userType: getRandomArrayItem(USER_TYPES)
    },
    commentsCount: 0
  };

  return [
    offer.title,
    offer.description,
    offer.publishDate,
    offer.city.name,
    offer.previewImage,
    offer.images.join(';'),
    String(offer.isPremium),
    String(offer.isFavorite),
    String(offer.rating),
    offer.housingType,
    String(offer.roomsCount),
    String(offer.guestsCount),
    String(offer.rentalPrice),
    offer.amenities.join(';'),
    offer.author.name,
    offer.author.email,
    offer.author.userType,
    String(offer.city.location.latitude),
    String(offer.city.location.longitude)
  ].join('\t');
};
