"use strict";

import express, { Request, Response, NextFunction } from "express";
import session from "express-session";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

// Initial setup and middleware
mongoose
  .connect("mongodb://localhost:27017/Memories")
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.error(err));

const PORT = process.env.PORT || 2000;
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

// Session setup with secure settings
app.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultFallbackSecret",
    saveUninitialized: false,
    resave: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 120000 * 60,
    },
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
    }),
  })
);

const mockusers = [
  { username: "username", password: "password", id: "userId" },
] as const;

// Middleware to refresh session expiration
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.session) req.session.touch();
  next();
});

// Authentication middleware
function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.session.userId) return next();
  res.status(401).send({ msg: "Not Authenticated" });
}

// Login route
app.post("/api/auth", (req: Request, res: Response) => {
  const { username, password } = req.body;
  const findUser = mockusers.find((user) => user.username === username);

  if (!findUser || findUser.password !== password) {
    return void res.status(401).send({ msg: "Bad Credentials" });
  }

  req.session.regenerate((err) => {
    if (err) return void res.status(500).send("Error regenerating session");
    req.session.userId = findUser.id;
    res.status(200).send(findUser);
  });
});

// Auth status route
app.get("/api/auth/status", isAuthenticated, (req: Request, res: Response) => {
  const findUser = mockusers.find((user) => user.id === req.session.userId);
  if (!findUser) return void res.status(404).send("User not found");
  res.status(200).send(findUser);
});

// Logout route
app.post("/api/auth/logout", (req: Request, res: Response) => {
  if (!req.session.userId) {
    return void res.sendStatus(401);
  }
  req.session.destroy((err) => {
    if (err) return void res.status(500).send("Logout failed");
    res.clearCookie("connect.sid");
    res.send("Logged out");
  });
});

// Centralized error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send({ error: "Something went wrong" });
});

app.listen(PORT, () => console.log(`Server is now running on port PORT`));
