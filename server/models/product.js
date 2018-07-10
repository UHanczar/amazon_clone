import mongoose from 'mongoose';
import DeepPopulate from 'mongoose-deep-populate';

const deepPopulate = DeepPopulate(mongoose);

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
  image: String,
  title: String,
  description: String,
  price: Number,
  created: { type: Date, default: Date.now }
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});

ProductSchema
  .virtual('averageRating')
  .get(function() {
    let rating;
    if (this.reviews.length === 0) {
      rating = 0;
    } else {
      rating = this.reviews.reduce((val, i) => val += i.rating, 0) / this.reviews.length;
    }

    return rating;
  });

ProductSchema.plugin(deepPopulate);

export default mongoose.model('Product', ProductSchema);
