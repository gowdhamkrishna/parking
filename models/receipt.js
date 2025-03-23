"use server"
import mongoose from 'mongoose';

const receiptSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  parkingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parking',
    required: true,
    index: true
  },
  bookingDate: {
    type: Date,
    required: true,
    index: true
  },
  duration: {
    type: Number,
    required: true,
    min: 1,
    max: 24
  },
  startTime: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
      },
      message: 'Start time must be in HH:MM format'
    }
  },
  endTime: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
      },
      message: 'End time must be in HH:MM format'
    }
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'cancelled'],
    default: 'pending',
    index: true
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
    required: true,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  cancellationReason: {
    type: String,
    trim: true,
    sparse: true
  }
});

// Update timestamp on save
receiptSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const ReceiptModel = mongoose.models.Receipt || mongoose.model('Receipt', receiptSchema);

export { ReceiptModel as Receipt }; 