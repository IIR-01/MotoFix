const mongoose = require('mongoose');

// One User model for all three roles from the functional requirements doc.
// Vendor-only fields are simply left unset for customers/admins.
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['customer', 'vendor', 'admin'], default: 'customer' },

    // Vendor-only fields (Registration and Login System — Common Workflow SL1)
    businessName: { type: String },
    address: { type: String },
    serviceCategory: { type: String, enum: ['parts_store', 'mechanic_center'] },
    tradeLicense: { type: String },
    verificationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'suspended'],
      default: 'pending',
    },
    listingFeePaid: { type: Boolean, default: false }, // wired up for real by Hafizur's SSLCommerz feature

    // Mechanic-vendor-only field (Raad's Module 1 feature)
    availabilityStatus: {
      type: String,
      enum: ['Available', 'Busy', 'Offline'],
      default: 'Offline',
    },

    // Mechanic-vendor-only: shop location, captured via browser geolocation
    // at registration. Stored as GeoJSON (note: [lng, lat] order, not
    // [lat, lng] — MongoDB requirement) so a 2dsphere index can be queried.
    // Optional at the schema level so parts-store vendors and any
    // already-existing accounts don't break.
    location: {
      type: { type: String, enum: ['Point'] },
      coordinates: { type: [Number] },
    },

    // Running total, not a stored average, so the average never drifts
    // from float rounding.
    ratingSum: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

userSchema.index({ location: '2dsphere' });
module.exports = mongoose.model('User', userSchema);