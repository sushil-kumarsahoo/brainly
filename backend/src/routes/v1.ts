import { Router } from "express";
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { UserModel } from "../models/user.model.js";
import bcrypt from 'bcrypt';
import { authUser } from "../middlewares/auth.middleware.js";
import { ContentModel } from "../models/content.model.js";
import { LinkModel } from "../models/link.model.js";
import { makeid } from "../utils/makeid.js";
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
v1Router.post("/content", authUser, async (req, res) => {
    try {
        const { link, title, type } = req.body;
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" })
        };
        const content = await ContentModel.create({
            type,
            link,
            title,
            userId,
            tags: [],
        })

        return res.status(201).json({ message: "Content added successfully", content })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: "Validation failed",
                errors: error.issues.map((issue) => issue.message),
            });
        }
        console.error(error);   // see the real error in your terminal
        return res.status(500).json({ message: "Internal server error" });
    }
});

v1Router.get("/content", authUser, async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const content = await ContentModel.find({ userId: userId }).populate("userId", "username");
        return res.status(200).json({ content });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

v1Router.delete("/content/:id", authUser, async (req, res) => {
    try {
        const contentId = req.params.id;
        if (!contentId) {
            return res.status(400).json({ message: "Invalid content id" });
        }
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const result = await ContentModel.deleteOne({ _id: contentId, userId });
        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: "Content not found"
            });
        }
        return res.status(200).json({ message: "Content deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }

});

v1Router.get("/getUser", authUser, async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const user = await UserModel.findOne({ _id: userId });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json({ status: user.status });
        return;
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
        return;
    }
});

// Share Links Routes
v1Router.get("/brain/gethash", authUser, async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        const link = await LinkModel.findOne({ userId });
        if (!link) {
            return res.status(404).json({ message: "You have not shared any brain yet." });
        }
        return res.status(200).json({ hash: link.hash });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
});

// Turn sharing on/off. Body: { share: true | false } 
v1Router.post("/brain/changeStatus", authUser, async (req, res) => {
    const { share } = req.body;
    if (typeof share !== "boolean") {
        return res.status(400).json({ message: "share must be true or false" });
    }
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        if (share) {
            const link = await LinkModel.findOneAndUpdate({ userId }, { $setOnInsert: { hash: makeid(10) } }, { upsert: true, new: true });
            await UserModel.updateOne({ _id: req.userId }, { status: true });
            return res.status(200).json({ message: "Sharing enabled", hash: link?.hash })
        }

        await LinkModel.deleteOne({ userId });
        await UserModel.updateOne({ _id: req.userId }, { status: false });
        return res.status(200).json({ message: "Sharing disabled" })
    } catch (error) {
        res.status(500).json({ message: "server error" });
    }
});

// Public route: no Auth, anyone with the hash can view
v1Router.get("/brain/:share", async (req, res) => {
    try {
        const link = await LinkModel.findOne({ hash: req.params.share });
        if (!link) {
            return res.status(404).json({ message: "Link not found" });
        }
        const user = await UserModel.findById(link.userId).select("username");
        if (!user) {
            return res.status(404).json({ message: "User doesnt exist" })
        }

        const contents = await ContentModel.find({ userId: link.userId }).select("-userId");
        return res.status(200).json({ message: user.username, contents });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
});

export default v1Router;
