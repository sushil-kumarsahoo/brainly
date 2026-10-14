import { Router } from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import { ContentModel } from "../models/content.model.js";
import z from "zod";

const contentRouter = Router();

const ContentSchema = z.object({
    title: z.string().min(1, "Title is required"),
    link: z.string().min(1, "Link is required"),
    type: z.string().min(1, "Type is required"),
});

// Content Routes
contentRouter.post("/", authUser, async (req, res) => {
    try {
        const { link, title, type } = ContentSchema.parse(req.body);
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

contentRouter.get("/", authUser, async (req, res) => {
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

contentRouter.delete("/:id", authUser, async (req, res) => {
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

export default contentRouter;