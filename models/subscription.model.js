import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Subscription Name is required"],
    trim: true,
    maxlength: [100, "Subscription Name must be less than 100 characters"],
    minlength: [2, "Subscription Name must be at least 2 characters"]
  },
  price: {
    type: Number,
    required: [true, "Subscription Price is required"],
    min: [0, "Subscription Price must be a positive number"]
  },
  currency: {
    type: String,
    enum: ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'SEK', 'NZD'],
    default: 'USD',
  },
  frequency: {
    type: String,
    enum: ['Daily', 'Weekly', 'Monthly', 'Yearly'],
  },
  category: {
    type: String,
    enum: ['Entertainment', 'Productivity', 'Health', 'Education', 'Other'],
    required: [true, "Subscription Category is required"],
  },
  paymentMethod: {
    type: String,
    required: [true, "Payment Method is required"],
    trim: true,
  },
  status: {
    type: String,
    enum: ['Active', 'Expired', 'Paused', 'Cancelled'],
    default: 'Active',
  },
  startDate: {
    type: Date,
    required: [true, "Subscription Start Date is required"],
    // validate: {
    //   validator: function(value) {
    //     return value <= new Date();
    //   },
    //   message: "Start Date cannot be in the future"
    // }
  },
  renewalDate: {
    type: Date,
    validate: {
      validator: function(value) {
        return value >= this.startDate;
      },
      message: "Renewal Date cannot be before the Start Date"
    }
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "Subscription must be associated with a User"],
    index: true,
  }
}, { timestamps: true });

// auto calculate renewalDate based on frequency
subscriptionSchema.pre('save', function() {
  if(!this.renewalDate && this.startDate) {
    const renewalPeriods = {
      'Daily': 1,
      'Weekly': 7,
      'Monthly': 30,
      'Yearly': 365
    };
    this.renewalDate = new Date(this.startDate);
    this.renewalDate.setDate(
      this.renewalDate.getDate() + renewalPeriods[this.frequency]
    );
  }

  // auto update status based on renewal date
  const currentDate = new Date();
  if(this.renewalDate < currentDate) {
    this.status = 'Expired';
  }

  // next();
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;