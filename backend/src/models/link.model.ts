import mongoose, { model } from "mongoose";
import { Schema } from "mongoose";

const linkSchema = new Schema({
    hash: { type: String, unique: true, required: true },
    userId: { type: mongoose.Types.ObjectId, ref: 'User',unique:true,required:true},
});

export const LinkModel = model("Link", linkSchema);