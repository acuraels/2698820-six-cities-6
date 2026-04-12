import mongoose, {Schema, type HydratedDocument, type InferSchemaType, type Model} from 'mongoose';

const OfferSchema = new Schema(
  {
    title: {type: String, required: true},
    description: {type: String, required: true},
    publishDate: {type: Date, required: true},
    city: {
      name: {type: String, required: true},
      location: {
        latitude: {type: Number, required: true},
        longitude: {type: Number, required: true}
      }
    },
    previewImage: {type: String, required: true},
    images: [{type: String, required: true}],
    isPremium: {type: Boolean, required: true},
    isFavorite: {type: Boolean, required: true},
    favoriteUserIds: [{type: Schema.Types.ObjectId, ref: 'User', default: []}],
    rating: {type: Number, required: true, default: 0},
    housingType: {type: String, required: true},
    roomsCount: {type: Number, required: true},
    guestsCount: {type: Number, required: true},
    rentalPrice: {type: Number, required: true},
    amenities: [{type: String, required: true}],
    authorId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    commentsCount: {type: Number, required: true, default: 0}
  },
  {
    timestamps: true
  }
);

export type OfferEntity = InferSchemaType<typeof OfferSchema>;
export type OfferDocument = HydratedDocument<OfferEntity>;
export type OfferModel = Model<OfferEntity>;

export const createOfferModel = (): OfferModel => (mongoose.models.Offer as OfferModel) || mongoose.model<OfferEntity>('Offer', OfferSchema);
