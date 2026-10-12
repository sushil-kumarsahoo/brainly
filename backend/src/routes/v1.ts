import { Router } from "express";
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { UserModel } from "../models/UserModel.js";
import bcrypt from 'bcrypt';
const v1Router = Router();

const SignupSchema = z.object({
    username: z.string().min(3, "Too short").max(20),
    password: z.string().min(6, "Too short")
});

v1Router.post("/signup", async (req, res) => {
    try {
        const { username, password } = SignupSchema.parse(req.body);
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await UserModel.create({
            username,
            password: hashedPassword
        })

        res.status(201).json({
            message: "User signed up successfully", user: { id: newUser._id, username: newUser.username },
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({
                message: "Validation failed",
                errors: error.issues.map(error => error.message)
            });
        }
        if ((error as { code?: number }).code === 11000) {
            return res.status(409).json({ message: "Username already exists" });
        }
        res.status(500).json({ message: "Internal server error" })
    }
});

v1Router.post("/signin", async (req, res) => {
    try {
        const { username, password } = SignupSchema.parse(req.body);
        const user = await UserModel.findOne({ username }).select("+password");
        if (!user) {
            return res.status(401).json({ message: "Invalid username or password" })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Inavlaid username or pasword" });
        }

        const token = jwt.sign(
            { id: user._id }, process.env.JWT_SECRET!, { expiresIn: "1h" })

        return res.status(200).json({ Message: "User signed in successfully", token });


    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: "Validation failed",
                errors: error.issues.map((issue) => issue.message),
            });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Content Routes
v1Router.post("/content", (req, res) => {
    res.json({ message: "Create content" });
});

v1Router.get("/content", (req, res) => {
    res.json({ message: "Get content" });
});

v1Router.delete("/content", (req, res) => {
    res.json({ message: "Delete content" });
});

// Share Links Routes
v1Router.post("/brain/share", (req, res) => {
    res.json({ message: "Share link generated" });
});

v1Router.get("/brain/:shareLink", (req, res) => {
    res.json({ message: `Fetching shared brain for link: ${req.params.shareLink}` });
});

export default v1Router;
