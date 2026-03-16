import mongoose, {Schema, type HydratedDocument, type InferSchemaType, type Model} from 'mongoose';

const CommentSchema = new Schema(
  {
    text: {type: String, required: true},
    publishDate: {type: Date, required: true},
    rating: {type: Number, required: true},
    authorId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    offerId: {type: Schema.Types.ObjectId, ref: 'Offer', required: true}
  },
  {
    timestamps: true
  }
);

export type CommentEntity = InferSchemaType<typeof CommentSchema>;
export type CommentDocument = HydratedDocument<CommentEntity>;
export type CommentModel = Model<CommentEntity>;

export const createCommentModel = (): CommentModel =>
  (mongoose.models.Comment as CommentModel) || mongoose.model<CommentEntity>('Comment', CommentSchema);
