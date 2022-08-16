import userModel from "../Models/userModel.js";
import bcript from 'bcrypt'


//import allluser
export const getAllUser = async(req,res) => {
    try {
        const users = await userModel.find();
        res.status(200).json({
            data: users
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


//import user 

export const getUser = async(req,res) => {
    const id = req.params.id;

    try {
        const user = await userModel.findById(id)

        if (user){
            const {password, ...details} = user._doc
            res.status(200).json({
                message: 'userFound',
                data: details
            })
        }else {
            res.status(404).json({
                message: "User Not Found"
            })
        }

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }

}


//update info

export const updateUser= async(req,res) => {
    const id = req.params.id
    const {currentUserId, currentUserAdminStatus, password} = req.body
    if (id === currentUserId || currentUserAdminStatus) {
        try {
            if(password) {
                const salt = await bcript.genSalt(10)
                req.body.password = await bcript.hash(password, salt)
            }
            const user = await userModel.findByIdAndUpdate(id, req.body, {new: true})
            res.status(200).json({
                message: 'Success Updating Data',
                data: user
            })
        } catch (error) {
            res.status(500).json({
                message: error.message
            })
        }
    } else {
        res.status(403).json({
            message: 'Forbiden Access'
        })
    }

}

//delete user

export const deleteUser = async(req,res) => {
    const id = req.params.id

    const {currentUserId, currentUserAdminStatus} = req.body

    if(id === currentUserId || currentUserAdminStatus){
        try {
            await userModel.findByIdAndDelete(id)
            res.status(200).json({
                message: "User Deleted Sucessfully"
            })
        } catch (error) {
            res.status(500).json({
                message: error.message
            })
        }
    }else {
        res.status(403).json({
            message: "Forbiden Access"
        })
    }
}


//user follower

export const userFollow = async(req,res) => {
    const id = req.params.id

    const {currentUserId} = req.body

    if(currentUserId === id) {
        res.status(403).json({
            message: "dont follow your self!"
        })
    }else {
        try {
            const followUser = await userModel.findById(id)
            const followingUser = await userModel.findById(currentUserId)

            if(!followUser.followers.includes(currentUserId)){
                await followUser.updateOne( {$push : {followers: currentUserId}} )
                await followingUser.updateOne({$push : {following: id}})
                res.status(200).json({
                    message: 'User Followed'
                })
            }else {
                res.status(403).json({
                    message: "User Already Followed"
                })
            }

        } catch (error) {
            res.status(500).json({
                message: error.message
            })
        }
    }
}



//user unfollower

export const userUnfollow = async(req,res) => {
    const id = req.params.id

    const {currentUserId} = req.body

    if(currentUserId === id) {
        res.status(403).json({
            message: "dont follow your self!"
        })
    }else {
        try {
            const followUser = await userModel.findById(id)
            const followingUser = await userModel.findById(currentUserId)

            if(followUser.followers.includes(currentUserId)){
                await followUser.updateOne( {$pull : {followers: currentUserId}} )
                await followingUser.updateOne({$pull : {following: id}})
                res.status(200).json({
                    message: 'User Unfollowed'
                })
            }else {
                res.status(403).json({
                    message: "User is not being  Followed"
                })
            }

        } catch (error) {
            res.status(500).json({
                message: error.message
            })
        }
    }
}