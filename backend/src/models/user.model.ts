import { model, Schema } from "mongoose";

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        select: false
    },
     status:{type:Boolean,required:true, default: false}
});

export const UserModel = model("User", UserSchema);