export const CITY_NAMES = [
  'Paris',
  'Cologne',
  'Brussels',
  'Amsterdam',
  'Hamburg',
  'Dusseldorf'
] as const;

export const USER_TYPES = ['usual', 'pro'] as const;

export const HOUSING_TYPES = ['apartment', 'house', 'room', 'hotel'] as const;

export const AMENITIES = [
  'Breakfast',
  'Air conditioning',
  'Laptop friendly workspace',
  'Baby seat',
  'Washer',
  'Towels',
  'Fridge'
] as const;

export type CityName = (typeof CITY_NAMES)[number];
export type UserType = (typeof USER_TYPES)[number];
export type HousingType = (typeof HOUSING_TYPES)[number];
export type Amenity = (typeof AMENITIES)[number];

export type Location = {
  latitude: number;
  longitude: number;
};

export type City = {
  name: CityName;
  location: Location;
};

export type User = {
  name: string;
  email: string;
  avatarPath?: string;
  password?: string;
  userType: UserType;
};

export type Offer = {
  title: string;
  description: string;
  publishDate: string;
  city: City;
  previewImage: string;
  images: [string, string, string, string, string, string];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  housingType: HousingType;
  roomsCount: number;
  guestsCount: number;
  rentalPrice: number;
  amenities: Amenity[];
  author: User;
  commentsCount: number;
};

export type Comment = {
  text: string;
  publishDate: string;
  rating: number;
  author: User;
};
