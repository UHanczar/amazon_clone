import mongoose from 'mongoose';
import DeepPopulate from 'mongoose-deep-populate';

const deepPopulate = DeepPopulate(mongoose);
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User'},
  totalPrice: { type: Number, default: 0},
  products: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product'},
    quantity: { type: Number, default: 1 }
  }]
});

OrderSchema.plugin(deepPopulate);

export default mongoose.model('Order', OrderSchema);
