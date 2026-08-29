const mongoose = require('mongoose');
const crypto = require('crypto');

// A saved snapshot of a customer's customization choices ("My Garage").
// selection is denormalized (category/key/label) instead of just keys, so a
// saved or shared build still displays correctly even if the underlying
// CustomizationOption catalog changes later.
const customBuildSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    vehicle: {
      make: { type: String, required: true },
      model: { type: String, required: true },
      year: { type: Number, required: true },
      bodyType: { type: String },
      baseImageUrl: { type: String },
    },
    selection: [
      {
        _id: false,
        category: { type: String, required: true },
        key: { type: String, required: true },
        label: { type: String, required: true },
      },
    ],
    previewImageUrl: { type: String },
    shareToken: { type: String, unique: true },
  },
  { timestamps: true }
);

customBuildSchema.pre('validate', function assignShareToken() {
  if (!this.shareToken) this.shareToken = crypto.randomBytes(8).toString('hex');
});

module.exports = mongoose.model('CustomBuild', customBuildSchema);
