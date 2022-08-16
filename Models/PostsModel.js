import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    userid: {
        type: String,
        required: true
    },
    desc: String,
    likes: [],
    images: String,
},
{
    timestamps: true,
}
);

const postModel = mongoose.model("Post", postSchema);
export default postModel