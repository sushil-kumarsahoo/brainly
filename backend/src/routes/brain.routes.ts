import { Router } from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import { UserModel } from "../models/user.model.js";
import { LinkModel } from "../models/link.model.js";
import { ContentModel } from "../models/content.model.js";
import { makeid } from "../utils/makeid.js";

const brainRoter = Router();

brainRoter.get("/share-status", authUser, async (req, res) => {
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
brainRoter.get("/share", authUser, async (req, res) => {
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
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
});

// Turn sharing on/off. Body: { share: true | false } 
brainRoter.put("/share", authUser, async (req, res) => {
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
        if ((error as { code?: number }).code === 11000) {
            const link = await LinkModel.findOne({ userId });
            if (link) {
                return res.status(200).json({ message: "Sharing enabled", hash: link?.hash });
            }
        }
        console.error(error);

        res.status(500).json({ message: "server error" });
    }
});

// Public route: no Auth, anyone with the hash can view
brainRoter.get("/:shareLink", async (req, res) => {
    try {
        const link = await LinkModel.findOne({ hash: req.params.shareLink });
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


export default brainRoter;