import postModel from "../Models/PostsModel.js";
import mongoose from "mongoose";
import userModel from "../Models/userModel.js";


//create new Post

export const createPost = async(req,res) => {
    const newPost = new postModel(req.body);

    try {
        await newPost.save();
        res.status(200).json({
            message: "new Post Creates",
            data: newPost
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


//get a post

export const getPost = async(req,res) => {
    const id = req.params.id;

    try {
        const post = await postModel.findById(id)
        res.status(200).json({
            message: "Post Fetched",
            data: post
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

//update Post

export const updatePost = async(req,res) => {
    const postId = req.params.id;
    const {userid} = req.body;

    try {
        const post = await postModel.findById(postId)

        if(post.userid === userid){
                await post.updateOne( { $set : req.body } )
            res.status(200).json({
                message: "Post Updated",
            })
        }else{
            res.status(403).json({
                message: "Forbiden For You"
            })
        }


    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}



//delete Post

export const deletePost = async(req,res) => {
    const id = req.params.id;
    const {userid} = req.body

    try {
        const post = await postModel.findById(id)
        if(post.userid === userid){
            await post.deleteOne();
            res.status(200).json({
                message: "Post Deleted"
            })
        }else{
            res.status(403).json({
                message: "Tindakan Ilegal"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

//like and dislike

export const postLike = async(req,res) => {
    const id = req.params.id;
    const {userid} = req.body

    try {
        const post = await postModel.findById(id)

        if(!post.likes.includes(userid)){
            await post.updateOne( {$push: {likes: userid}} )
            res.status(200).json({
                message: "Post Liked"
            })
        }else {
            await post.updateOne( {$pull: {likes: userid}} )
            res.status(200).json({
                message: "Post unLiked"
            })
        }

    } catch (error) {
        res.status(500).json({
            message: error.message 
        })
    }
}



//getTimeLinePost 

export const getTimelinePost = async(req,res) => {
    const userid = req.params.id

    try {
        const currentUserPosts = await postModel.find({userid : userid})
        const followingPosts = await userModel.aggregate([
            {
                $match: {
                    _id : new mongoose.Types.ObjectId(userid)
                }
            },
            {
                $lookup : {
                    from: 'posts',
                    localField: 'following',
                    foreignField: 'userid',
                    as: "followingPosts"
                }
            },
            {
                $project: {
                    followingPosts: 1,
                    _id : 0
                }
            }
        ])

        res.status(200).json(currentUserPosts.concat(...followingPosts[0].followingPosts)
        .sort((a,b) => {
            return b.createdAt - a.createdAt
        })
        )
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}