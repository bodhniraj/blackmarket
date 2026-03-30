const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    trim: true,
    minlength: [3, "Username must be at least 3 characters"],
    maxlength: [20, "Username cannot exceed 20 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
    select: false,
  },
  avatar: {
    type: String,
    default: "",
  },
  totalGames: {
    type: Number,
    default: 0,
  },
  totalWins: {
    type: Number,
    default: 0,
  },
  bestScore: {
    type: Number,
    default: 0,
  },
  totalSavings: {
    type: Number,
    default: 0,
  },
  rank: {
    type: String,
    default: "Street Rat",
    enum: ["Street Rat", "Hustler", "Dealer", "Kingpin", "Black Market Legend"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
// Hash password before saving
userSchema.pre("save", async function () {
  // Automatically update rank whenever user is saved
  this.updateRank();

  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  // No next() needed for async functions in modern Mongoose
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update rank based on total games
userSchema.methods.updateRank = function () {
  if (this.totalGames >= 50) this.rank = "Black Market Legend";
  else if (this.totalGames >= 20) this.rank = "Kingpin";
  else if (this.totalGames >= 10) this.rank = "Dealer";
  else if (this.totalGames >= 3) this.rank = "Hustler";
  else this.rank = "Street Rat";
};

module.exports = mongoose.model("User", userSchema);
