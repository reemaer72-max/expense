import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
    index: true,
  },
  userEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: "",
    trim: true,
  },
  notes: {
    type: String,
    default: "",
    trim: true,
  },
  description: {
    type: String,
    default: "",
    trim: true,
  },
});

const ExpenseModel = mongoose.model("Expenses", ExpenseSchema);

export default ExpenseModel;
