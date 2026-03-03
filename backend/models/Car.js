const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  pricePerDay: { type: Number, required: true },
  transmission: { type: String, enum: ['Automatic', 'Manual'], required: true },
  fuelType: { type: String, enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'], required: true },
  seats: { type: Number, required: true },
  images: [{ type: String }], 
  isAvailable: { type: Boolean, default: true },
  description: { type: String },
  location: { type: String, required: true }, 
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } 
}, { timestamps: true });

module.exports = mongoose.model('Car', carSchema);