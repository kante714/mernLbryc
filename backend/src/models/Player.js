const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'] },
    slug: { type: String, required: true, unique: true, index: true },
    position: {
      type: String,
      required: true,
      enum: ['goalkeeper', 'defender', 'midfielder', 'forward', 'coaching-staff'],
    },
    squad: {
      type: String,
      enum: ['men', 'women', 'under-21', 'under-18', 'e-sports'],
      default: 'men',
    },
    shirtNumber: { type: Number, default: null },
    nationality: { type: String, default: '' },
    nationalityFlag: { type: String, default: '' },
    photoUrl: { type: String, default: '' },
    onLoan: { type: Boolean, default: false },
    stats: {
      appearances: { type: Number, default: 0 },
      goals: { type: Number, default: 0 },
      assists: { type: Number, default: 0 },
      cleanSheets: { type: Number, default: 0 },
      yellowCards: { type: Number, default: 0 },
      redCards: { type: Number, default: 0 },
    },
    bio: { type: String, default: '' },
    dateOfBirth: { type: Date },
    height: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Player', playerSchema);
