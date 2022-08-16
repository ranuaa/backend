import userModel from "../Models/userModel.js";
import bycript from 'bcrypt' 
import jwt from 'jsonwebtoken'


// register new user
export const registerUser = async(req, res) => {

    const salt = await bycript.genSalt(10)
    const hashedPassword = await bycript.hash(req.body.password, salt)
    req.body.password = hashedPassword
    const newUser = new userModel(req.body);
    const {username} = req.body

    try {

        const oldUser = await userModel.findOne({username})

        if (oldUser){
            res.status(400).json({
                message: "Username Sudah Ada Bosskuhh"
            })
        }

        const user = await newUser.save()

        const token = jwt.sign({
            username: user.username,
            id : user._id
        }, process.env.JWT_KEY, {expiresIn: '30days' })
        res.status(200).json({
            message: 'succeed',
            data: newUser,
            token: token
        })
    } catch (error) {
        res.status(401).json({
            message: error.message
        })
    }
}

//Login User

export const loginUser = async(req,res) => {
    const {username, password} = req.body;

    try {
        const user = await userModel.findOne({username: username})

        if (user){
            const valid = await bycript.compare(password, user.password)

            // valid? res.status(200).json(user): res.status(400).json({message: 'Wrong Password'})
            if(!valid){
                res.status(400).json({
                    message: "Password Salah Bosskuh"
                })
            }else {
                const token = jwt.sign({
                    username: user.username,
                    id: user._id,
                }, process.env.JWT_KEY, {expiresIn: '30days'})
                res.status(200).json({
                    message: 'Oke Bosskuh',
                    data: user,
                    token: token
                })
            }

        }else {
            res.status(404).json({message: 'User Not Found'})
        }
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}