import { Router } from "express";
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { UserModel } from "../models/user.model.js";
import bcrypt from 'bcrypt';

const authRouter = Router();

const SignupSchema = z.object({
    username: z.string().min(3, "Too short").max(20),
    password: z.string().min(6, "Too short")
});

authRouter.post("/signup", async (req, res) => {
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

authRouter.post("/signin", async (req, res) => {
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


export default authRouter;
