// models/patient.model.js
import mongoose from "mongoose";

const testSchema = new mongoose.Schema({
  testName: { type: String, required: true },
  price: { type: Number, required: true }
});

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    sex: { type: String, enum: ["Male", "Female", "Other"], required: true },
    mobile: { type: String, required: true },

    tests: [testSchema], // list of tests

    totalAmount: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    pendingAmount: { type: Number, default: 0 },

    paymentMode: {
      type: String,
      enum: ["Cash", "Paytm", "Online"],
      default: "Cash"
    },
    date: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model("Patient", patientSchema);
