import mongoose from 'mongoose';
import DeepPopulate from 'mongoose-deep-populate';
import mongooseAlgolia from 'mongoose-algolia';

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
ProductSchema.plugin(mongooseAlgolia, {
  appId: 'WWDWJ5LD7N',
  apiKey: '8896f69a2fd022c3dbaf08fd25b49b3c',
  indexName: 'amazone_clone',
  selector: '_id title image reviews description price owner created averageRating',
  populate: {
    path: 'owner reviews',
    select: 'name rating'
  },
  defaults: {
    author: 'unknown'
  },
  mappings: {
    title: function(value) {
      return `${value}`
    }
  },
  virtuals: {
    averageRating: function(doc) {
      var rating = 0;
      if (doc.reviews.length == 0) {
        rating = 0;
      } else {
        doc.reviews.map((review) => {
          rating += review.rating;
        });
        rating = rating / doc.reviews.length;
      }

      return rating;
    }
  },
  debug: true
});

const Model =  mongoose.model('Product', ProductSchema);
Model.SyncToAlgolia();
Model.SetAlgoliaSettings({
  searchableAttributes: ['title']
});

export default Model;
