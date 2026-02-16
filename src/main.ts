#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import chalk from 'chalk';

import { AMENITIES, CITY_NAMES, type CityName, type HousingType, HOUSING_TYPES, type Offer, type UserType, USER_TYPES } from './types/entities.js';

const HELP_TEXT = `
Программа для подготовки данных для REST API сервера.

Пример:
  main.js --<command> [--arguments]

Команды:
  --help                      Печатает этот текст
  --version                   Выводит номер версии приложения
  --import <path>             Импортирует данные из TSV файла
`;

const TSV_COLUMNS_COUNT = 19;

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

const parseOfferLine = (line: string, lineNumber: number): Offer => {
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

const getAppVersion = (): string => {
    const packageJsonPath = new URL('../package.json', import.meta.url);
    const rawPackageJson = readFileSync(packageJsonPath, 'utf8');
    const packageJson = JSON.parse(rawPackageJson) as { version: string };

    return packageJson.version;
};

const printHelp = (): void => {
    console.log(chalk.cyan(HELP_TEXT.trim()));
};

const printVersion = (): void => {
    console.log(chalk.green(getAppVersion()));
};

const runImport = (filepath?: string): void => {
    if (!filepath) {
        console.error(chalk.red('Ошибка: не указан путь к TSV файлу.'));
        console.log(chalk.yellow('Пример: npm run cli -- --import ./mocks/offers.tsv'));
        process.exitCode = 1;
        return;
    }

    const absolutePath = resolve(filepath);
    if (!existsSync(absolutePath)) {
        console.error(chalk.red(`Ошибка: файл не найден: ${absolutePath}`));
        process.exitCode = 1;
        return;
    }

    const rawData = readFileSync(absolutePath, 'utf8').trim();
    if (!rawData) {
        console.warn(chalk.yellow(`Файл ${absolutePath} пуст. Импортировать нечего.`));
        return;
    }

    const lines = rawData.split(/\r?\n/);

    try {
        const offers = lines.map((line, index) => parseOfferLine(line, index + 1));

        console.log(chalk.green(`Импорт успешно завершён: ${offers.length} предложений.`));
        offers.forEach((offer, index) => {
            console.log(chalk.yellow(`${index + 1}. ${offer.title} (${offer.city.name}) - ${offer.rentalPrice}€`));
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
        console.error(chalk.red(`Ошибка импорта: ${message}`));
        process.exitCode = 1;
    }
};

const runCli = (): void => {
    const [command, argument] = process.argv.slice(2);

    switch (command) {
        case undefined:
        case '--help':
            printHelp();
            break;
        case '--version':
            printVersion();
            break;
        case '--import':
            runImport(argument);
            break;
        default:
            console.error(chalk.red(`Неизвестная команда: ${command}`));
            process.exitCode = 1;
    }
};

runCli();
