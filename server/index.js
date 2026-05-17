import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import UserModel from "./Models/UserModel.js";
import ExpenseModel from "./Models/ExpenseModel.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const allowedOrigins = new Set([
  process.env.CLIENT_URL,
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
].filter(Boolean));

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    methods: "GET,POST,PUT,DELETE,PATCH",
    credentials: true,
  }),
);

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const fallbackConnectString =
  "mongodb://User2:user2ex@ac-kri1omk-shard-00-00.6sxi5pv.mongodb.net:27017,ac-kri1omk-shard-00-01.6sxi5pv.mongodb.net:27017,ac-kri1omk-shard-00-02.6sxi5pv.mongodb.net:27017/dexpenseDb?ssl=true&replicaSet=atlas-2qjzeh-shard-0&authSource=admin&appName=ExpCluster";
const connectString = process.env.MONGO_URI || fallbackConnectString;

mongoose
  .connect(connectString)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("DB Error:", err));

const getUserFilter = (req) => {
  const userId = req.query.userId || req.body.userId;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return null;
  }

  return { userId };
};

app.post("/registerUser", async (req, res) => {
  try {
    const { name, email, password, income } = req.body;
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ error: "Email is already registered" });
    }

    const hashedpassword = await bcrypt.hash(password, 10);
    const user = new UserModel({
      name,
      email,
      password: hashedpassword,
      income: Number(income) || 0,
    });

    await user.save();

    res.status(201).json({
      user,
      msg: "User created",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ error: "Wrong password" });
    }

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/logout", (req, res) => {
  res.json({ message: "Logged out" });
});

app.post("/addExpense", async (req, res) => {
  try {
    const {
      userId,
      userEmail,
      title,
      amount,
      date,
      category,
      notes,
      description,
    } = req.body;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Valid user is required" });
    }

    const expense = await ExpenseModel.create({
      userId,
      userEmail,
      title,
      amount,
      date,
      category,
      notes,
      description,
    });

    res.status(201).json({ expense });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/getExpenses", async (req, res) => {
  try {
    const userFilter = getUserFilter(req);

    if (!userFilter) {
      return res.status(400).json({ error: "Valid user is required" });
    }

    const expenses = await ExpenseModel.find(userFilter).sort({
      date: -1,
      _id: -1,
    });

    res.json({ expenses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/updateExpense/:id", async (req, res) => {
  try {
    const userFilter = getUserFilter(req);

    if (!userFilter) {
      return res.status(400).json({ error: "Valid user is required" });
    }

    const { userId, userEmail, ...updatedExpense } = req.body;
    const expense = await ExpenseModel.findOneAndUpdate(
      { _id: req.params.id, ...userFilter },
      updatedExpense,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    res.json({ expense });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete("/deleteExpense/:id", async (req, res) => {
  try {
    const userFilter = getUserFilter(req);

    if (!userFilter) {
      return res.status(400).json({ error: "Valid user is required" });
    }

    const expense = await ExpenseModel.findOneAndDelete({
      _id: req.params.id,
      ...userFilter,
    });

    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    res.json({ id: req.params.id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put("/updateIncome", async (req, res) => {
  try {
    const { email, income } = req.body;
    const user = await UserModel.findOneAndUpdate(
      { email },
      { income: Number(income) || 0 },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/getUser/:identifier", async (req, res) => {
  try {
    const { identifier } = req.params;
    const user = mongoose.Types.ObjectId.isValid(identifier)
      ? await UserModel.findById(identifier)
      : await UserModel.findOne({ email: identifier });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const port = process.env.PORT || 3002;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
